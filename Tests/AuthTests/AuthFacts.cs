using Fonlow.Auth;
using Fonlow.Testing;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Fonlow.Auth.Models;

namespace AuthTests
{
	public class AuthTestsFixture : BasicHttpClient
	{
		public AuthTestsFixture()
		{
			var c = TestingSettings.Instance.ServiceCommands["LaunchIdentityWebApi"];
			this.HttpClient.BaseAddress = new System.Uri(c.BaseUrl);

			IConfiguration config = new ConfigurationBuilder()
				.AddJsonFile("appsettings.json")
				.Build();

			//ClockSkewMilliseconds = int.Parse(config["ClockSkewSeconds"]) * 1000;
			System.Text.Json.JsonSerializerOptions jsonSerializerSettings = new System.Text.Json.JsonSerializerOptions()
			{
				DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
				PropertyNameCaseInsensitive = true,
				NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString, // newtonsoft.json along with converters may return long and int128 as string
			};

			Api = new AuthClient(HttpClient, jsonSerializerSettings);
			BaseUrl = c.BaseUrl;
		}

		//public int ClockSkewMilliseconds { get; private set; }

		public AuthClient Api { get; private set; }
		public string BaseUrl { get; private set; }
	}

	[Collection(IntegrationTests.TestConstants.LaunchWebApiAndInit)]
	public class AuthFacts : IClassFixture<AuthTestsFixture>
	{
		public AuthFacts(AuthTestsFixture fixture)
		{
			api = fixture.Api;
			baseUrl = fixture.BaseUrl;
		}

		readonly AuthClient api;
		readonly string baseUrl;
		[Fact]
		public async Task TestPostRopcTokenRequestAsFormDataToAuthAsync()
		{
			var r = await api.PostRopcTokenRequestAsFormDataToAuthAsync(new ROPCRequst
			{
				Username = "admin",
				Password = "Pppppp*8"
			});

			Assert.Equal("bearer", r.token_type, true);
			Assert.NotNull(r.access_token);
			Assert.NotNull(r.refresh_token);
			Assert.True(r.expires_in > 0);
		}

		[Fact]
		public async Task TestPostRefreshTokenRequestAsFormDataToAuthAsync()
		{
			var ra = await api.PostRopcTokenRequestAsFormDataToAuthAsync(new ROPCRequst
			{
				Username = "admin",
				Password = "Pppppp*8"
			});

			HttpClient client = new HttpClient();
			client.BaseAddress = new Uri(baseUrl);
			client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", ra.access_token);
			AuthClient authClient = new AuthClient(client);
			var r = await authClient.PostRefreshTokenRequestAsFormDataToAuthAsync(new RefreshAccessTokenRequest
			{
				refresh_token = ra.refresh_token,
				Scope=ra.Scope,
			});

			Assert.Equal("bearer", r.token_type, true);
			Assert.NotNull(r.access_token);
			Assert.NotNull(r.refresh_token);
			Assert.True(r.expires_in > 0);
		}

		[Fact]
		public async Task TestRefreshTokenButNotAuthenticatedThrows()
		{
			var ra = await api.PostRopcTokenRequestAsFormDataToAuthAsync(new ROPCRequst
			{
				Username = "admin",
				Password = "Pppppp*8"
			});

			var ex = await Assert.ThrowsAsync<Fonlow.Auth.WebApiRequestException>(()=> api.PostRefreshTokenRequestAsFormDataToAuthAsync(new RefreshAccessTokenRequest
			{
				refresh_token = ra.refresh_token
			}));

			Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);
		}


	}
}
