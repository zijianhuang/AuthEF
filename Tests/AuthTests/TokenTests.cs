using Fonlow.Net.Http;
using Fonlow.Testing;
using Fonlow.WebApp.Accounts;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using Xunit.Abstractions;

namespace AuthTests
{
	public class TokenTestsFixture : DefaultHttpClient
	{

	}


	[Collection(IntegrationTests.TestConstants.LaunchWebApiAndInit)]
	public class TokenTests : IClassFixture<TokenTestsFixture>
	{
		private readonly ITestOutputHelper output;

		public TokenTests(TokenTestsFixture fixture, ITestOutputHelper output)
		{
			baseUri = fixture.BaseUri;
			httpClient = fixture.HttpClient;
			this.output = output;
		}

		readonly Uri baseUri;

		readonly HttpClient httpClient;


		[Fact]
		public void Test100SiginWithNewHttpClient()
		{
			for (int i = 0; i < 100; i++)
			{
				var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
				Assert.NotEmpty(tokenText);

				var toeknModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
				Assert.NotNull(toeknModel.AccessToken);
			}
		}

		[Fact]
		public void Test100RefreshTokenWithNewHttpClient()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);

			var currentRefreshToken = tokenModel.RefreshToken;
			var currentAccesstoken = tokenModel.AccessToken;
			TestAuthorizedConnection(tokenModel.TokenType, currentAccesstoken);

			for (int i = 0; i < 100; i++)
			{
				var newTokenModel = GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, currentRefreshToken, tokenModel.Username, tokenModel.ConnectionId);
				Assert.Equal(tokenModel.Username, newTokenModel.Username);
				Assert.NotEqual(currentRefreshToken, newTokenModel.RefreshToken);
				//Assert.NotEqual(currentAccesstoken, newTokenModel.AccessToken); sometimes equal, probably due to that I request frequently.
				currentRefreshToken = newTokenModel.RefreshToken;
				currentAccesstoken = newTokenModel.AccessToken; // for bearer token in new request
			}

			//Assert.NotEqual(tokenModel.AccessToken, currentAccesstoken); sometime equal
			TestAuthorizedConnection(tokenModel.TokenType, currentAccesstoken);

			TestAuthorizedConnection(tokenModel.TokenType, tokenModel.AccessToken); // old token is till working. To revoke, refer to https://stackoverflow.com/questions/62874537/jwt-token-forcefully-expire-in-asp-net-core-3-1, as JWT is by design not revokeable, and ASP.NET (Core) security hornor this. Another way simplier, just to set the expiry with 5 minutes span, if 5 minutes is accetable by your enterprise security policy.
		}

		[Fact]
		public void TestRefreshTokenWithNewHttpClient()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);

			var newTokenModel = GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, tokenModel.RefreshToken, tokenModel.Username, tokenModel.ConnectionId);
			Assert.Equal(tokenModel.Username, newTokenModel.Username);
			TestAuthorizedConnection(newTokenModel.TokenType, newTokenModel.AccessToken);
		}

		/// <summary>
		/// Access token should expire after expiry time + clock skew.
		/// It should not expire just after expiry time if clock skew is not zero.
		/// </summary>
		[Fact]
		public void TestAccessTokenExpiry()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);
			output.WriteLine($"token ExpiresIn {tokenModel.ExpiresIn}; Expires: {tokenModel.Expires}");

			TestAuthorizedConnection(tokenModel.TokenType, tokenModel.AccessToken);
			Thread.Sleep(5050); // expiry is 5 seconds in appsetings.json of the Web service.
			TestAuthorizedConnection(tokenModel.TokenType, tokenModel.AccessToken); // should work because of the 2-seconds clock skew.
			Thread.Sleep(2000);
			var ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() => TestAuthorizedConnection(tokenModel.TokenType, tokenModel.AccessToken));
			Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);
		}

		/// <summary>
		/// After expiry, use refresh token to accquire new access token.
		/// </summary>
		[Fact]
		public void TestAccessTokenExpiryThenGetNewViaRefreshToken()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);
			output.WriteLine($"token ExpiresIn {tokenModel.ExpiresIn}; Expires: {tokenModel.Expires}");

			TestAuthorizedConnection(tokenModel.TokenType, tokenModel.AccessToken);
			Thread.Sleep(7050);
			var ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() => TestAuthorizedConnection(tokenModel.TokenType, tokenModel.AccessToken));
			Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);

			var newTokenModel = GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, tokenModel.RefreshToken, tokenModel.Username, tokenModel.ConnectionId);
			Assert.Equal(tokenModel.Username, newTokenModel.Username);
			Assert.NotEqual(tokenModel.RefreshToken, newTokenModel.RefreshToken);
			TestAuthorizedConnection(tokenModel.TokenType, newTokenModel.AccessToken);

			Assert.NotEqual(tokenModel.AccessToken, newTokenModel.AccessToken);
		}

		[Fact]
		public void TestRefreshTokenWithCorruptedDataThrows()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);

			var ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() => GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, tokenModel.RefreshToken + "A", tokenModel.Username, tokenModel.ConnectionId));
			Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);
			Assert.Contains("Invalid to retrieve token through refreshToken", ex.Response);
			output.WriteLine("throws");
		}

		[Fact]
		public void TestRefreshTokenWithInvalidConnectionIdDataThrows()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);

			var ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() => GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, tokenModel.RefreshToken, tokenModel.Username, Guid.NewGuid()));
			Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);
			Assert.Contains("Invalid to retrieve token through refreshToken", ex.Response);
		}

		[Fact]
		public void Test100SiginWithSameHttpClient()
		{
			for (int i = 0; i < 100; i++)
			{
				var tokenText = GetTokenWithSameClient(baseUri, "admin", "Pppppp*8");
				Assert.NotEmpty(tokenText);

				var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
				Assert.NotNull(tokenModel.AccessToken);
			}
		}

		[Fact]
		public void Test100RefreshTokenWithSameHttpClient()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);

			var currentRefreshToken = tokenModel.RefreshToken;
			var currentAccesstoken = tokenModel.AccessToken;
			TestAuthorizedConnection(tokenModel.TokenType, currentAccesstoken);

			for (int i = 0; i < 100; i++)
			{
				var newTokenModel = GetTokenResponseModelByRefreshTokenWithSameClient(baseUri, currentRefreshToken, tokenModel.Username, tokenModel.ConnectionId);
				Assert.Equal(tokenModel.Username, newTokenModel.Username);
				Assert.NotEqual(currentRefreshToken, newTokenModel.RefreshToken);
				//Assert.NotEqual(currentAccesstoken, newTokenModel.AccessToken); sometimes equal, probably due to that I request frequently.
				currentRefreshToken = newTokenModel.RefreshToken;
				currentAccesstoken = newTokenModel.AccessToken; // for bearer token in new request
			}

			//Assert.NotEqual(tokenModel.AccessToken, currentAccesstoken); //sometimes still equal
			TestAuthorizedConnection(tokenModel.TokenType, currentAccesstoken);

			TestAuthorizedConnection(tokenModel.TokenType, tokenModel.AccessToken); // old token is till working. To revoke, refer to https://stackoverflow.com/questions/62874537/jwt-token-forcefully-expire-in-asp-net-core-3-1, as JWT is by design not revokeable, and ASP.NET (Core) security hornor this. Another way simplier, just to set the expiry with 5 minutes span, if 5 minutes is accetable by your enterprise security policy.
		}

		[Fact]
		public void TestLogoutThenRefreshTokenThrows()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);

			var newTokenModel = GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, tokenModel.RefreshToken, tokenModel.Username, tokenModel.ConnectionId);
			Assert.Equal(tokenModel.Username, newTokenModel.Username);
			Assert.NotEqual(tokenModel.RefreshToken, newTokenModel.RefreshToken);
			TestAuthorizedConnection(tokenModel.TokenType, newTokenModel.AccessToken);

			GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, newTokenModel.RefreshToken, newTokenModel.Username, newTokenModel.ConnectionId);
			using var httpClient = new HttpClient();
			httpClient.BaseAddress = baseUri;
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.TokenType, newTokenModel.AccessToken);
			var accountApi = new DemoWebApi.Controllers.Client.Account(httpClient);
			accountApi.Logout(newTokenModel.ConnectionId); // this will remove the refresh token of the user on connnectionId
			Assert.Throws<WebApiRequestException>(() => GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, newTokenModel.RefreshToken, newTokenModel.Username, newTokenModel.ConnectionId));
		}

		[Fact]
		public void TestRemoveOldUserTokensThenRefreshTokenThrows()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);

			var newTokenModel = GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, tokenModel.RefreshToken, tokenModel.Username, tokenModel.ConnectionId);
			Assert.Equal(tokenModel.Username, newTokenModel.Username);
			Assert.NotEqual(tokenModel.RefreshToken, newTokenModel.RefreshToken);
			TestAuthorizedConnection(tokenModel.TokenType, newTokenModel.AccessToken);

			GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, newTokenModel.RefreshToken, newTokenModel.Username, newTokenModel.ConnectionId);
			using var httpClient = new HttpClient();
			httpClient.BaseAddress = baseUri;
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.TokenType, newTokenModel.AccessToken);
			var accountApi = new DemoWebApi.Controllers.Client.Account(httpClient);
			accountApi.RemoveOldUserTokens(DateTime.UtcNow); // Remove all user tokens, typically refresh tokens
			Assert.Throws<WebApiRequestException>(() => GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, newTokenModel.RefreshToken, newTokenModel.Username, newTokenModel.ConnectionId));
		}

		[Fact]
		public void TestAdminRemoveUserTokensThenRefreshTokenThrows()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<TokenResponseModel>(tokenText);
			Assert.NotNull(tokenModel.RefreshToken);

			var newTokenModel = GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, tokenModel.RefreshToken, tokenModel.Username, tokenModel.ConnectionId);
			Assert.Equal(tokenModel.Username, newTokenModel.Username);
			Assert.NotEqual(tokenModel.RefreshToken, newTokenModel.RefreshToken);
			TestAuthorizedConnection(tokenModel.TokenType, newTokenModel.AccessToken);

			GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, newTokenModel.RefreshToken, newTokenModel.Username, newTokenModel.ConnectionId);
			using var httpClient = new HttpClient();
			httpClient.BaseAddress = baseUri;
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.TokenType, newTokenModel.AccessToken);
			var accountApi = new DemoWebApi.Controllers.Client.Account(httpClient);
			accountApi.AdminRemoveUserRefreshTokens(newTokenModel.Username); 
			Assert.Throws<WebApiRequestException>(() => GetTokenResponseModelByRefreshTokenWithNewClient(baseUri, newTokenModel.RefreshToken, newTokenModel.Username, newTokenModel.ConnectionId));
		}



		void TestAuthorizedConnection(string tokenType, string accessToken)
		{
			using var httpClient = new HttpClient();
			httpClient.BaseAddress = baseUri;
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenType, accessToken);
			var heroesApi = new DemoWebApi.Controllers.Client.Heroes(httpClient);
			var heroes = heroesApi.GetHeros(); //this one won't need auth, and won't trigger authentication on the service side.
			Assert.NotEmpty(heroes);
			heroesApi.Put(heroes[0]); // this one needs auth.
		}

		string GetTokenWithClient(Uri baseUri, string userName, string password, HttpClient client)
		{
			var pairs = new KeyValuePair<string, string>[]
						{
							new KeyValuePair<string, string>( "grant_type", "password" ),
							new KeyValuePair<string, string>( "username", userName ),
							new KeyValuePair<string, string> ( "password", password )
						};
			var content = new FormUrlEncodedContent(pairs);
			try
			{
				var response = client.PostAsync(new Uri(baseUri, "Token"), content).Result;
				if (!response.IsSuccessStatusCode)
				{
					var error = String.Format("Please check app.config or appsettings.json or Web dependencies. Cannot get token for {0}:{1} with Uri {2}, with status code {3} and message {4}", userName, password, baseUri, response.StatusCode, response.ReasonPhrase);
					Trace.TraceError(error);
					throw new System.Security.Authentication.AuthenticationException(error);
				}

				var text = response.Content.ReadAsStringAsync().Result;
				return text;
			}
			catch (AggregateException e)
			{
				e.Handle((innerException) =>
				{
					Trace.TraceWarning(innerException.Message);
					return false;//Better to make it false here, since the test runner may shutdown before the trace message could be written to the log file.
				});
				return null;
			}
		}

		string GetTokenWithNewClient(Uri baseUri, string userName, string password)
		{
			using (var client = new HttpClient())
			{
				return GetTokenWithClient(baseUri, userName, password, client);
			}
		}

		string GetTokenWithSameClient(Uri baseUri, string userName, string password)
		{
			return GetTokenWithClient(baseUri, userName, password, this.httpClient);
		}


		TokenResponseModel GetTokenResponseModelByRefreshTokenWithSameClient(Uri baseUri, string refreshToken, string username, Guid connectionId)
		{
			return GetTokenResponseModel(baseUri, refreshToken, username, connectionId, this.httpClient);
		}

		TokenResponseModel GetTokenResponseModelByRefreshTokenWithNewClient(Uri baseUri, string refreshToken, string username, Guid connectionId)
		{
			using (var client = new HttpClient())
			{
				client.BaseAddress = baseUri;
				return GetTokenResponseModel(baseUri, refreshToken, username, connectionId, client);
			}
		}

		TokenResponseModel GetTokenResponseModel(Uri baseUri, string refreshToken, string username, Guid connectionId, HttpClient client)
		{
			return GetTokenResponseModel(client, (headers) =>
			{
				headers.Add("refreshToken", refreshToken);
				headers.Add("username", username);
				headers.Add("connectionId", connectionId.ToString("N"));
			});
		}
		TokenResponseModel GetTokenResponseModel(HttpClient client, Action<System.Net.Http.Headers.HttpRequestHeaders> handleHeaders = null)
		{
			var requestUri = "Token/tokenByRefreshToken";
			using var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, requestUri);
			handleHeaders?.Invoke(httpRequestMessage.Headers);
			var responseMessage = client.SendAsync(httpRequestMessage).Result;
			try
			{
				responseMessage.EnsureSuccessStatusCodeEx();
				var stream = responseMessage.Content.ReadAsStreamAsync().Result;
				using JsonReader jsonReader = new JsonTextReader(new System.IO.StreamReader(stream));
				var serializer = JsonSerializer.Create();
				return serializer.Deserialize<TokenResponseModel>(jsonReader);
			}
			finally
			{
				responseMessage.Dispose();
			}
		}



	}
}