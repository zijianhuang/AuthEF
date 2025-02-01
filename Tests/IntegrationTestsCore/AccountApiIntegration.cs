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
			Api.Logout(Guid.NewGuid());//so to test Logout. Random Id is ok, since the logout process does not really care
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
		public void TestGetUserInfo()
		{
			UserInfoViewModel info = api.GetUserInfo();
			Assert.False(String.IsNullOrEmpty(info.FullName));
			Assert.False(String.IsNullOrEmpty(info.Email));
		}

		[Fact]
		public void TestGetUserIdMapByFullName()
		{
			KeyValuePair<string, Guid>[] map = api.GetUserIdMapByFullName();
			Assert.True(map.Length > 0);
		}

		[Fact]
		public void TestGetUserIdMapByEmail()
		{
			KeyValuePair<string, Guid>[] map = api.GetUserIdMapByEmail();
			Assert.True(map.Length > 0);
		}

		[Fact]
		public void TestChangePasswordConfirmFail()
		{
			Fonlow.Net.Http.WebApiRequestException ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() =>
			 {
				 HttpResponseMessage response = api.ChangePassword(new ChangePasswordBindingModel
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
		public void TestRegisterUser()
		{
			string stamp = DateTime.Now.ToString("yyMMddHHmmssfff");
			string username = "ApiUserZ" + stamp;
			var id = api.Register(new RegisterBindingModel
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
		public void TestRegisterUserWithUnmatchedPasswordShouldThrow()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmss");
			Fonlow.Net.Http.WebApiRequestException ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() =>
			{
				var response = api.Register(new RegisterBindingModel
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
		public void TestRegisterUserAndAddRole()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = api.Register(new RegisterBindingModel
			{
				UserName = username,
				Email = username + "@somewhere.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			});

			Assert.NotEqual(default(Guid), id);

			api.AddRole(id, "Manager");
			api.AddRole(id, "Admin");
			string[] roles = api.GetRoles(id);
			Assert.Equal(2, roles.Length);
		}

		[Fact]
		public void TestRegisterUserAndAddBadRoleNameThrow()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = api.Register(new RegisterBindingModel
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
		public void TestRegisterUserAndAddRoleThenRemove()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = api.Register(new RegisterBindingModel
			{
				UserName = username,
				Email = username + "@somewhere.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			});

			Assert.NotEqual(default(Guid), id);

			api.AddRole(id, "Manager");
			api.RemoveRole(id, "Manager");
		}

		[Fact]
		public void TestRegisterUserAndAddRoleThenRemoveAnother()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = api.Register(new RegisterBindingModel
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
		public void TestRegisterUserAndAddRoleThenRemoveBadOne()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			var id = api.Register(new RegisterBindingModel
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
		public void TestDeleteUserWithInvalidUserId()
		{
			HttpResponseMessage r = api.RemoveUser(Guid.NewGuid());
			Assert.Equal(System.Net.HttpStatusCode.NoContent, r.StatusCode);
		}


		[Fact]
		public void TestRegisterUserThenUpdate()
		{
			string username = "ApiUser" + DateTime.Now.ToString("yyMMddHHmmssfff");
			RegisterBindingModel model = new RegisterBindingModel
			{
				UserName = username,
				Email = username + "@somewhere.com",
				Password = "Mmmm*123",
				ConfirmPassword = "Mmmm*123",
			};

			var id = api.Register(model);

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
