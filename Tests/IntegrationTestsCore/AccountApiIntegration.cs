using Fonlow.Testing;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using Fonlow.Net.Http;
using Newtonsoft.Json.Serialization;
using DemoWebApi.DemoData.Client;
using DemoWebApi.Controllers.Client;
using Xunit;
using Fonlow.Auth.Models;
using Fonlow.AspNetCore.Identity.Client;
using System;
using System.Threading.Tasks;
using Fonlow.Auth.Controllers.Client;
using System.Net.Http;
using System.Collections.Generic;

namespace IntegrationTests
{
	public class AccountFixture : AuthEfHttpClientWithUsername
	{
		public AccountFixture()
		{
			base.AuthorizedClient.BaseAddress = base.BaseUri;
			System.Text.Json.JsonSerializerOptions jsonSerializerSettings = new System.Text.Json.JsonSerializerOptions()
			{
				DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
				PropertyNameCaseInsensitive = true,
				NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString, // newtonsoft.json along with converters may return long and int128 as string
			}; 
			
			Api = new Account(base.AuthorizedClient, jsonSerializerSettings);
		}

		public Account Api { get; private set; }

		protected override void Dispose(bool disposing)
		{
			Task.Run(async ()=> await Api.LogoutAsync(Guid.NewGuid())).Wait();//so to test Logout. Random Id is ok, since the logout process does not really care
			base.Dispose(disposing);
		}
	}

	[Collection(TestConstants.LaunchWebApiAndInit)]
	public class AccountApiIntegration : IClassFixture<AccountFixture>
	{
		public AccountApiIntegration(AccountFixture fixture)
		{
			api = fixture.Api;
			httpClient = fixture.AuthorizedClient;
			username=fixture.Username;
		}

		readonly Account api;
		readonly HttpClient httpClient;
		readonly string username;


		[Fact]
		public async Task TestGetUserInfo()
		{
			UserInfoViewModel info = await api.GetUserInfoAsync();
			Assert.False(String.IsNullOrEmpty(info.FullName));
			Assert.False(String.IsNullOrEmpty(info.Email));
		}

		[Fact]
		public async Task TestGetUserIdMapByFullName()
		{
			KeyValuePair<string, Guid>[] map = await api.GetUserIdMapByFullNameAsync();
			Assert.True(map.Length > 0);
		}

		[Fact]
		public async Task TestGetUserIdMapByEmail()
		{
			KeyValuePair<string, Guid>[] map = await api.GetUserIdMapByEmailAsync();
			Assert.True(map.Length > 0);
		}

		[Fact]
		public async Task TestChangePasswordConfirmFail()
		{
			Fonlow.Net.Http.WebApiRequestException ex = await Assert.ThrowsAsync<Fonlow.Net.Http.WebApiRequestException>(async () =>
			 {
				 HttpResponseMessage response = await api.ChangePasswordAsync(new ChangePasswordBindingModel
				 {
					 OldPassword = "Mmmmmm*8",
					 NewPassword = "Mmmmmm*8",
					 ConfirmPassword = "Mmmmmmkkk*8",
				 });

				 Assert.True(false);
			 });

			Assert.Equal(System.Net.HttpStatusCode.BadRequest, ex.StatusCode);
		}

		[Fact]
		public async Task TestRegisterUser()
		{
			string stamp = DateTime.Now.ToString("yyMMddHHmmssfff");
			string username = "ApiUserZ" + stamp;
			var id = await api.RegisterAsync(new RegisterBindingModel
			{
				UserName = username,
//                Email = username + "@somewhere.com",
				Email = $"zijian.aps+{stamp}@gmail.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			});

			Assert.NotEqual(default(Guid), id);

			System.Threading.Thread.Sleep(3500);
		}

		[Fact]
		public async Task TestRegisterUserWithUnmatchedPasswordShouldThrow()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmss");
			Fonlow.Net.Http.WebApiRequestException ex = await Assert.ThrowsAsync<Fonlow.Net.Http.WebApiRequestException>(async () =>
			{
				var response = await api.RegisterAsync(new RegisterBindingModel
				{
					UserName = username,
					Email = username + "@somewhere.com",
					Password = "Mmmm*123",
					ConfirmPassword = "Mmmm*123k",
				});
			});

			Assert.Equal(System.Net.HttpStatusCode.BadRequest, ex.StatusCode);
		}

		[Fact]
		public async Task TestRegisterUserAndAddRole()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = await api.RegisterAsync(new RegisterBindingModel
			{
				UserName = username,
				Email = username + "@somewhere.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			});

			Assert.NotEqual(default(Guid), id);

			await api.AddRoleAsync(id, "Manager");
			await api.AddRoleAsync(id, "Admin");
			string[] roles = api.GetRoles(id);
			Assert.Equal(2, roles.Length);
		}

		[Fact]
		public async Task TestRegisterUserAndAddBadRoleNameThrow()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = await api.RegisterAsync(new RegisterBindingModel
			{
				UserName = username,
				Email = username + "@somewhere.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			});

			Assert.NotEqual(default(Guid), id);

			Fonlow.Net.Http.WebApiRequestException ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() => api.AddRole(id, "BadRoleName"));
			Assert.Equal(System.Net.HttpStatusCode.BadRequest, ex.StatusCode);
		}

		[Fact]
		public async Task TestRegisterUserAndAddRoleThenRemove()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = await api.RegisterAsync(new RegisterBindingModel
			{
				UserName = username,
				Email = username + "@somewhere.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			});

			Assert.NotEqual(default(Guid), id);

			await api.AddRoleAsync(id, "Manager");
			await api.RemoveRoleAsync(id, "Manager");
		}

		[Fact]
		public async Task TestRegisterUserAndAddRoleThenRemoveAnother()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = await api.RegisterAsync(new RegisterBindingModel
			{
				UserName = username,
				Email = username + "@somewhere.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			});

			Assert.NotEqual(default(Guid), id);

			api.AddRole(id, "Manager");
			api.RemoveRole(id, "Admin");//Yes, the API just keep quiet, though will log an error.
		}

		[Fact]
		public async Task TestRegisterUserAndAddRoleThenRemoveBadOne()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = await api.RegisterAsync(new RegisterBindingModel
			{
				UserName = username,
				Email = username + "@somewhere.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			});

			Assert.NotEqual(default(Guid), id);

			api.RemoveRole(id, "Badone");//Yes, the API just keep quiet, though will log an error.
		}

		[Fact]
		public async Task TestDeleteUserWithInvalidUserId()
		{
			HttpResponseMessage r = await api.RemoveUserAsync(Guid.NewGuid());
			Assert.Equal(System.Net.HttpStatusCode.NoContent, r.StatusCode);
		}


		[Fact]
		public async Task TestRegisterUserThenUpdate()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			RegisterBindingModel model = new RegisterBindingModel
			{
				UserName = username,
				Email = username + "@somewhere.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			};

			var id = await api.RegisterAsync(model);

			Assert.NotEqual(default(Guid), id);

			UserUpdate userUpdate = new UserUpdate
			{
				Id = id,
				Email = model.Email + ".au",
				FullName=model.FullName,
			};

			api.Update(userUpdate);

			//var u = api.GetUserInfo(id);
			//Assert.Equal(model.Email + ".au", u.Email);
		}



	}


}
