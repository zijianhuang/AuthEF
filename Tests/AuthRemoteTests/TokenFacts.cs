using DemoWebApi.Controllers.Client;
using Fonlow.Auth.Models;
using Fonlow.Net.Http;
using Fonlow.Testing;
using Fonlow.WebApp.Accounts;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Diagnostics;
using Xunit.Abstractions;

namespace AuthRemoteTests
{
    public class TokenTestsFixture : BasicHttpClient
    {
        public TokenTestsFixture()
        {
            IConfiguration config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            ClockSkewMilliseconds = int.Parse(config["ClockSkewSeconds"]) * 1000;
            HttpClient.BaseAddress = new Uri(TestingSettings.Instance.BaseUrl);
        }

        public int ClockSkewMilliseconds { get; private set; }
    }


    public class TokenFacts : IClassFixture<TokenTestsFixture>
    {
        private readonly ITestOutputHelper output;

        public TokenFacts(TokenTestsFixture fixture, ITestOutputHelper output)
        {
            baseUri = fixture.HttpClient.BaseAddress;
            httpClient = fixture.HttpClient;
            this.output = output;
            this.clockSkewSeconds = fixture.ClockSkewMilliseconds;
        }

        readonly Uri baseUri;

        readonly HttpClient httpClient;

        readonly int clockSkewSeconds;


        [Fact]
        public void Test100SiginWithNewHttpClient()
        {
            for (int i = 0; i < 100; i++)
            {
                var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
                Assert.NotEmpty(tokenText);

                var toeknModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
                Assert.NotNull(toeknModel.access_token);
            }
        }

        [Fact]
        public void Test100RefreshTokenWithNewHttpClient()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            Assert.NotEmpty(tokenText);

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);

            var currentRefreshToken = tokenModel.refresh_token;
            var currentAccesstoken = tokenModel.access_token;
            TestAuthorizedNewConnection(tokenModel.token_type, currentAccesstoken);

            for (int i = 0; i < 100; i++)
            {
                var newTokenModel = GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, currentRefreshToken, tokenModel.ConnectionId);

                Assert.NotEqual(currentRefreshToken, newTokenModel.refresh_token);
                //Assert.NotEqual(currentAccesstoken, newTokenModel.AccessToken); sometimes equal, probably due to that I request frequently.
                currentRefreshToken = newTokenModel.refresh_token;
                currentAccesstoken = newTokenModel.access_token; // for bearer token in new request
            }

            //Assert.NotEqual(tokenModel.AccessToken, currentAccesstoken); sometime equal
            TestAuthorizedNewConnection(tokenModel.token_type, currentAccesstoken);

            TestAuthorizedNewConnection(tokenModel.token_type, tokenModel.access_token); // old token is till working. To revoke, refer to https://stackoverflow.com/questions/62874537/jwt-token-forcefully-expire-in-asp-net-core-3-1, as JWT is by design not revokeable, and ASP.NET (Core) security hornor this. Another way simplier, just to set the expiry with 5 minutes span, if 5 minutes is accetable by your enterprise security policy.
        }

        [Fact]
        public void TestRefreshTokenWithNewHttpClient()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            Assert.NotEmpty(tokenText);

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);

            var newTokenModel = GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, tokenModel.refresh_token, tokenModel.ConnectionId);

            TestAuthorizedNewConnection(newTokenModel.token_type, newTokenModel.access_token);
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

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);
            output.WriteLine($"token ExpiresIn {tokenModel.expires_in}");

            TestAuthorizedNewConnection(tokenModel.token_type, tokenModel.access_token);
            Thread.Sleep(5050); // expiry is 5 seconds in appsetings.json of the Web service.
            TestAuthorizedNewConnection(tokenModel.token_type, tokenModel.access_token); // should work because of the 2-seconds clock skew.
            Thread.Sleep(clockSkewSeconds);
            var ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() => TestAuthorizedNewConnection(tokenModel.token_type, tokenModel.access_token));
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);
        }

        /// <summary>
        /// even the access token expired,the existing HTTP connection still work well, this seems to be a by-design behavior.
        /// </summary>
        [Fact]
        public void TestExpiredTokenWorksOnExistingConnection()
        {
            var httpClient = CreateAdminHttpClient();
            var heroesApi = new Heroes(httpClient);
            heroesApi.GetAsyncHeroes();
            Thread.Sleep(5050); // expiry is 5 seconds in appsetings.json of the Web service.
            heroesApi.GetHeros();
            Thread.Sleep(clockSkewSeconds);

            heroesApi.GetHeros(); //even the access token expired,the existing HTTP connection still work well, this seems to be a by-design behavior.
        }

        /// <summary>
        /// After expiry, use refresh token to accquire new access token.
        /// </summary>
        [Fact]
        public void TestAccessTokenExpiryThenGetNewViaRefreshToken()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            Assert.NotEmpty(tokenText);

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);
            output.WriteLine($"token ExpiresIn {tokenModel.expires_in}");

            TestAuthorizedNewConnection(tokenModel.token_type, tokenModel.access_token);
            Thread.Sleep(5000);
            Thread.Sleep(clockSkewSeconds);
            var ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() => TestAuthorizedNewConnection(tokenModel.token_type, tokenModel.access_token));
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);

            var newTokenModel = GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, tokenModel.refresh_token, tokenModel.ConnectionId);

            Assert.NotEqual(tokenModel.refresh_token, newTokenModel.refresh_token);
            TestAuthorizedNewConnection(tokenModel.token_type, newTokenModel.access_token);

            Assert.NotEqual(tokenModel.access_token, newTokenModel.access_token);
        }

        /// <summary>
        /// Corrupted token should result in Unauthorized
        /// </summary>
        [Fact]
        public void TestRefreshTokenWithCorruptedDataThrows()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            Assert.NotEmpty(tokenText);

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);

            var ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() => GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, tokenModel.refresh_token + "A", tokenModel.ConnectionId));
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);
            Assert.Contains("Invalid to retrieve token through refreshToken", ex.Response);
            output.WriteLine("throws");
        }

        /// <summary>
        /// User John may have multiple logins at the same time, using refresh token not from current login instance (connection Id) should result in Unauthorized.
        /// </summary>
        [Fact]
        public void TestRefreshTokenWithInvalidConnectionIdDataThrows()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            Assert.NotEmpty(tokenText);

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);

            var ex = Assert.Throws<Fonlow.Net.Http.WebApiRequestException>(() => GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, tokenModel.refresh_token, Guid.NewGuid()));
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

                var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
                Assert.NotNull(tokenModel.access_token);
            }
        }

        [Fact]
        public void Test100RefreshTokenWithSameHttpClient()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            Assert.NotEmpty(tokenText);

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);

            var currentRefreshToken = tokenModel.refresh_token;
            var currentAccesstoken = tokenModel.access_token;
            TestAuthorizedNewConnection(tokenModel.token_type, currentAccesstoken);

            for (int i = 0; i < 100; i++)
            {
                var newTokenModel = GetAccessTokenResponseByRefreshTokenWithSameClient(baseUri, currentRefreshToken, tokenModel.ConnectionId);

                Assert.NotEqual(currentRefreshToken, newTokenModel.refresh_token);
                //Assert.NotEqual(currentAccesstoken, newTokenModel.AccessToken); sometimes equal, probably due to that I request frequently.
                currentRefreshToken = newTokenModel.refresh_token;
                currentAccesstoken = newTokenModel.access_token; // for bearer token in new request
            }

            //Assert.NotEqual(tokenModel.AccessToken, currentAccesstoken); //sometimes still equal
            TestAuthorizedNewConnection(tokenModel.token_type, currentAccesstoken);

            TestAuthorizedNewConnection(tokenModel.token_type, tokenModel.access_token); // old token is till working. To revoke, refer to https://stackoverflow.com/questions/62874537/jwt-token-forcefully-expire-in-asp-net-core-3-1, as JWT is by design not revokeable, and ASP.NET (Core) security hornor this. Another way simplier, just to set the expiry with 5 minutes span, if 5 minutes is accetable by your enterprise security policy.
        }

        /// <summary>
        /// Logout should have the refresh token removed from the DB, thus using the refresh token afterward should throw 
        /// </summary>
        [Fact]
        public void TestLogoutThenRefreshTokenThrows()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            Assert.NotEmpty(tokenText);

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);

            using var httpClient = new HttpClient();
            httpClient.BaseAddress = baseUri;
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.token_type, tokenModel.access_token);
            var accountApi = new DemoWebApi.Controllers.Client.Account(httpClient);
            accountApi.Logout(tokenModel.ConnectionId); // this will remove the refresh token of the user on connnectionId
            var ex = Assert.Throws<WebApiRequestException>(() => GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, tokenModel.refresh_token, tokenModel.ConnectionId));
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);

            TestAuthorizedNewConnection(tokenModel.token_type, tokenModel.access_token); // still working, because JWT is stateless. This is a normal behavior.
        }

        /// <summary>
        /// After admin or house keeping removes all refresh tokens, using refresh token should throws 
        /// </summary>
        [Fact]
        public void TestRemoveOldUserTokensThenRefreshTokenThrows()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            Assert.NotEmpty(tokenText);

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);

            var newTokenModel = GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, tokenModel.refresh_token, tokenModel.ConnectionId);

            Assert.NotEqual(tokenModel.refresh_token, newTokenModel.refresh_token);
            TestAuthorizedNewConnection(tokenModel.token_type, newTokenModel.access_token);

            GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, newTokenModel.refresh_token, newTokenModel.ConnectionId);
            using var httpClient = new HttpClient();
            httpClient.BaseAddress = baseUri;
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.token_type, newTokenModel.access_token);
            var accountApi = new DemoWebApi.Controllers.Client.Account(httpClient);
            accountApi.RemoveOldUserTokens(DateTime.UtcNow); // Remove all user tokens, typically refresh tokens
            var ex = Assert.Throws<WebApiRequestException>(() => GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, newTokenModel.refresh_token, newTokenModel.ConnectionId));
            Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);
        }

        [Fact]
        public void TestAdminRemoveUserTokensThenRefreshTokenThrows()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            Assert.NotEmpty(tokenText);

            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            Assert.NotNull(tokenModel.refresh_token);

            var newTokenModel = GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, tokenModel.refresh_token, tokenModel.ConnectionId);

            Assert.NotEqual(tokenModel.refresh_token, newTokenModel.refresh_token);
            TestAuthorizedNewConnection(tokenModel.token_type, newTokenModel.access_token);

            GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, newTokenModel.refresh_token, newTokenModel.ConnectionId);
            using var httpClient = new HttpClient();
            httpClient.BaseAddress = baseUri;
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.token_type, newTokenModel.access_token);
            var accountApi = new DemoWebApi.Controllers.Client.Account(httpClient);
            accountApi.AdminRemoverRefreshTokensOfUsers("admin");
            Assert.Throws<WebApiRequestException>(() => GetAccessTokenResponseByRefreshTokenWithNewClient(baseUri, newTokenModel.refresh_token, newTokenModel.ConnectionId));
        }

        HttpClient CreateAdminHttpClient()
        {
            var tokenText = GetTokenWithNewClient(baseUri, "admin", "Pppppp*8");
            var tokenModel = System.Text.Json.JsonSerializer.Deserialize<AccessTokenResponse>(tokenText);
            var httpClient = new HttpClient();
            httpClient.BaseAddress = baseUri;
            httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(tokenModel.token_type, tokenModel.access_token);

            return httpClient;
        }

        void TestAuthorizedNewConnection(string tokenType, string accessToken)
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