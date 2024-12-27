using DemoWebApi.Controllers.Client;
using Fonlow.Auth.Models;
using Fonlow.Net.Http;
using Fonlow.WebApp.Accounts;
using Newtonsoft.Json;
using System.Diagnostics;
using Xunit.Abstractions;

namespace AuthRemoteTests
{
	public class AccountTests : IClassFixture<TokenTestsFixture>
	{
		private readonly ITestOutputHelper output;

		public AccountTests(TokenTestsFixture fixture, ITestOutputHelper output)
		{
			baseUri = fixture.HttpClient.BaseAddress;
			httpClient = fixture.HttpClient;
			this.output = output;
		}

		readonly Uri baseUri;

		readonly HttpClient httpClient;

		const string newUserPassword = "Mmmmmm981*";

		[Fact]
		public void TestRegisterUserThenLoginAsNewUser()
		{
			var newUsername = RegisterUser();

			// new user login
			var newUserTokenText = GetTokenWithNewClient(baseUri, newUsername, newUserPassword);
			var newUserTokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(newUserTokenText);
		}


		//[Fact] // for creating base of stress testing
		public void _RegisterManyManyUsers()
		{
			using var httpClient = CreateAdminHttpClient();
			var accountApi = new DemoWebApi.Controllers.Client.Account(httpClient);
			for (int i = 0; i < 100000; i++)
			{
				RegisterUserWithOneConnection(accountApi);
			}
		}

		string RegisterUser()
		{
			using var httpClient = CreateAdminHttpClient();
			var accountApi = new DemoWebApi.Controllers.Client.Account(httpClient);
			return RegisterUserWithOneConnection(accountApi);
		}

		HttpClient CreateAdminHttpClient(){
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
			var httpClient = new HttpClient();
			httpClient.BaseAddress = baseUri;
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.token_type, tokenModel.access_token);

			return httpClient;
		}

		string RegisterUserWithOneConnection(Account accountApi){
			var stamp = DateTime.Now.ToString("yyMMddHHmmssfff");
			var newUsername = "John" + stamp;
			var newUserId = accountApi.Register(new Fonlow.WebApp.Accounts.Client.RegisterBindingModel
			{
				UserName = newUsername,
				Password = newUserPassword,
				FullName = "John " + stamp,
				ConfirmPassword = newUserPassword,
				Email = newUsername + "@where.com"
			});

			accountApi.AddRole(newUserId, "user");
			return newUsername;

		}

		[Fact]
		public void TestRegisterWithInvalidUsernameThrows()
		{
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
			Assert.NotNull(tokenModel.refresh_token);

			using var httpClient = new HttpClient();
			httpClient.BaseAddress = baseUri;
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.token_type, tokenModel.access_token);
			var accountApi = new DemoWebApi.Controllers.Client.Account(httpClient);
			var stamp = DateTime.Now.ToString("yyMMddHHmmssfff");
			var newUsername = "John " + stamp; // a space make the username invalid
			var ex = Assert.Throws<WebApiRequestException>(() => accountApi.Register(new Fonlow.WebApp.Accounts.Client.RegisterBindingModel
			{
				UserName = newUsername,
				Password = newUserPassword,
				FullName = "John " + stamp,
				ConfirmPassword = newUserPassword,
				Email = newUsername + "@where.com"
			}));

			Assert.Equal(System.Net.HttpStatusCode.Conflict, ex.StatusCode);
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
				response.EnsureSuccessStatusCodeEx();

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


		AccessTokenResponse GetAccessTokenResponseByRefreshTokenWithSameClient(Uri baseUri, string refreshToken, Guid connectionId)
		{
			return GetAccessTokenResponse(baseUri, refreshToken, connectionId, this.httpClient);
		}

		AccessTokenResponse GetAccessTokenResponseByRefreshTokenWithNewClient(Uri baseUri, string refreshToken, Guid connectionId)
		{
			using (var client = new HttpClient())
			{
				client.BaseAddress = baseUri;
				return GetAccessTokenResponse(baseUri, refreshToken, connectionId, client);
			}
		}

		AccessTokenResponse GetAccessTokenResponse(Uri baseUri, string refreshToken, Guid connectionId, HttpClient client)
		{
			return GetAccessTokenResponse(client, (headers) =>
			{
				headers.Add("refreshToken", refreshToken);
				headers.Add("connectionId", connectionId.ToString("N"));
			});
		}
		AccessTokenResponse GetAccessTokenResponse(HttpClient client, Action<System.Net.Http.Headers.HttpRequestHeaders> handleHeaders = null)
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
				return serializer.Deserialize<AccessTokenResponse>(jsonReader);
			}
			finally
			{
				responseMessage.Dispose();
			}
		}



	}
}