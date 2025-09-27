using DemoWebApi.Controllers.Client;
using Fonlow.Net.Http;
using Fonlow.Testing;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.Net.WebSockets;
using Xunit.Abstractions;
using Fonlow.AspNetCore.Identity.Client;
using System.Management.Automation.Language;
using Fonlow.Auth.Models;
using Fonlow.Auth.Controllers.Client;

namespace AuthTests
{
	[Collection(IntegrationTests.TestConstants.LaunchWebApiAndInit)]
	public class AccountTests : TokenFactsBase, IClassFixture<TokenTestsFixture>
	{
		public AccountTests(TokenTestsFixture fixture, ITestOutputHelper output) : base(fixture, output)
		{
		}

		const string newUserPassword = "Mmmmmm981*";

		[Fact]
		public void TestRegisterUserThenLoginAsNewUser()
		{
			var newUsername = RegisterUser();

			// new user login
			var newUserTokenText = GetTokenWithNewClient(baseUri, newUsername, newUserPassword, null);
			var newUserTokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(newUserTokenText);
			var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
			var jwtSecurityToken = handler.ReadJwtToken(newUserTokenModel.access_token);
			Assert.Equal(newUsername, ExtractUsername(newUserTokenModel.access_token));
		}

		static string ExtractUsername(string accessToken)
		{
			var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
			var jwtSecurityToken = handler.ReadJwtToken(accessToken);
			var v = jwtSecurityToken.Claims.FirstOrDefault(d => d.Type == "unique_name");
			return v.Value;
		}


		[Fact]
		public void TestRemovedUserTryToLoginThrows()
		{
			var newUsername = RegisterUser();

			// new user login
			var newUserTokenText = GetTokenWithNewClient(baseUri, newUsername, newUserPassword, null);
			var newUserTokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(newUserTokenText);
			//Assert.Equal(newUsername, newUserTokenModel.Username);
			using var userHttpClient = new HttpClient();
			userHttpClient.BaseAddress = baseUri;
			userHttpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(newUserTokenModel.token_type, newUserTokenModel.access_token);
			var heroesApi = new Heroes(userHttpClient);
			heroesApi.GetHeros();


			//Admin to remove user
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8", null);
			Assert.NotEmpty(tokenText);
			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
			Assert.NotNull(tokenModel.refresh_token);
			using var httpClient = new HttpClient();
			httpClient.BaseAddress = baseUri;
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.token_type, tokenModel.access_token);
			var accountApi = new Account(httpClient);
			var userId = accountApi.GetUserIdByUser(newUsername);
			accountApi.RemoveUser(userId);

			var ex = Assert.Throws<WebApiRequestException>(() => GetTokenWithNewClient(baseUri, newUsername, newUserPassword, null));
			Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);

			heroesApi.GetHeros(); // the access token is still working, for a while.
			System.Threading.Thread.Sleep(7100);
			Assert.Throws<WebApiRequestException>(() => TestAuthorizedConnection(newUserTokenModel.token_type, newUserTokenModel.access_token)); // new connection should fail
			for (int i = 0; i < 10; i++)
			{
				heroesApi.GetHeros(); // existing connection is still working, as long as the HTTP connection remains.
			}
		}

		//[Fact] // for creating base of stress testing
		public void _RegisterManyManyUsers()
		{
			using var httpClient = CreateAdminHttpClient();
			var accountApi = new Account(httpClient);
			for (int i = 0; i < 100000; i++)
			{
				RegisterUserWithOneConnection(accountApi);
			}
		}

		string RegisterUser()
		{
			using var httpClient = CreateAdminHttpClient();
			var accountApi = new Account(httpClient);
			return RegisterUserWithOneConnection(accountApi);
		}

		HttpClient CreateAdminHttpClient(){
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8", null);
			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
			var httpClient = new HttpClient();
			httpClient.BaseAddress = baseUri;
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.token_type, tokenModel.access_token);

			return httpClient;
		}

		string RegisterUserWithOneConnection(Account accountApi){
			var stamp = DateTime.Now.ToString("yyMMddHHmmssfff");
			var newUsername = "John" + stamp;
			var newUserId = accountApi.Register(new RegisterBindingModel
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
			var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8", null);
			Assert.NotEmpty(tokenText);

			var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
			Assert.NotNull(tokenModel.refresh_token);

			using var httpClient = new HttpClient();
			httpClient.BaseAddress = baseUri;
			httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.token_type, tokenModel.access_token);
			var accountApi = new Account(httpClient);
			var stamp = DateTime.Now.ToString("yyMMddHHmmssfff");
			var newUsername = "John " + stamp; // a space make the username invalid
			var ex = Assert.Throws<WebApiRequestException>(() => accountApi.Register(new RegisterBindingModel
			{
				UserName = newUsername,
				Password = newUserPassword,
				FullName = "John " + stamp,
				ConfirmPassword = newUserPassword,
				Email = newUsername + "@where.com"
			}));

			Assert.Equal(System.Net.HttpStatusCode.BadRequest, ex.StatusCode);
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

		//string GetTokenWithClient(Uri baseUri, string userName, string password, HttpClient client)
		//{
		//	var pairs = new KeyValuePair<string, string>[]
		//				{
		//					new KeyValuePair<string, string>( "grant_type", "password" ),
		//					new KeyValuePair<string, string>( "username", userName ),
		//					new KeyValuePair<string, string> ( "password", password )
		//				};
		//	var content = new FormUrlEncodedContent(pairs);
		//	try
		//	{
		//		var response = client.PostAsync(new Uri(baseUri, "Token"), content).Result;
		//		response.EnsureSuccessStatusCodeEx();

		//		var text = response.Content.ReadAsStringAsync().Result;
		//		return text;
		//	}
		//	catch (AggregateException e)
		//	{
		//		e.Handle((innerException) =>
		//		{
		//			Trace.TraceWarning(innerException.Message);
		//			return false;//Better to make it false here, since the test runner may shutdown before the trace message could be written to the log file.
		//		});
		//		return null;
		//	}
		//}

		//string GetTokenWithNewClient(Uri baseUri, string userName, string password)
		//{
		//	using (var client = new HttpClient())
		//	{
		//		return GetTokenWithClient(baseUri, userName, password, client);
		//	}
		//}

		//string GetTokenWithSameClient(Uri baseUri, string userName, string password)
		//{
		//	return GetTokenWithClient(baseUri, userName, password, this.httpClient);
		//}


		//AccessTokenResponse GetAccessTokenResponseByRefreshTokenWithSameClient(Uri baseUri, string refreshToken, string username, Guid connectionId)
		//{
		//	return GetAccessTokenResponse(baseUri, refreshToken, connectionId, this.httpClient);
		//}

		//AccessTokenResponse GetAccessTokenResponseByRefreshTokenWithNewClient(Uri baseUri, string refreshToken, Guid connectionId)
		//{
		//	using (var client = new HttpClient())
		//	{
		//		client.BaseAddress = baseUri;
		//		return GetAccessTokenResponse(baseUri, refreshToken, connectionId, client);
		//	}
		//}

		//AccessTokenResponse GetAccessTokenResponse(Uri baseUri, string refreshToken, Guid connectionId, HttpClient client)
		//{
		//	return GetAccessTokenResponse(client, (headers) =>
		//	{
		//		headers.Add("refreshToken", refreshToken);
		//		headers.Add("connectionId", connectionId.ToString("N"));
		//	});
		//}
		//AccessTokenResponse GetAccessTokenResponse(HttpClient client, Action<System.Net.Http.Headers.HttpRequestHeaders> handleHeaders = null)
		//{
		//	var requestUri = "Token/tokenByRefreshToken";
		//	using var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, requestUri);
		//	handleHeaders?.Invoke(httpRequestMessage.Headers);
		//	var responseMessage = client.SendAsync(httpRequestMessage).Result;
		//	try
		//	{
		//		responseMessage.EnsureSuccessStatusCodeEx();
		//		var stream = responseMessage.Content.ReadAsStreamAsync().Result;
		//		using JsonReader jsonReader = new JsonTextReader(new System.IO.StreamReader(stream));
		//		var serializer = JsonSerializer.Create();
		//		return serializer.Deserialize<AccessTokenResponse>(jsonReader);
		//	}
		//	finally
		//	{
		//		responseMessage.Dispose();
		//	}
		//}



	}
}