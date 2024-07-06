using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using Fonlow.Net.Http;

namespace Fonlow.Auth.Client
{
	public class AuthClient
	{

		private System.Net.Http.HttpClient client;

		private JsonSerializerOptions jsonSerializerSettings;

		public AuthClient(System.Net.Http.HttpClient client, JsonSerializerOptions jsonSerializerSettings = null)
		{
			if (client == null)
				throw new ArgumentNullException(nameof(client), "Null HttpClient.");

			if (client.BaseAddress == null)
				throw new ArgumentNullException(nameof(client), "HttpClient has no BaseAddress");

			this.client = client;
			this.jsonSerializerSettings = jsonSerializerSettings;
		}

		/// <summary>
		/// Post ROPC request as FormData to auth token endpoint.
		/// </summary>
		/// <param name="model"></param>
		/// <param name="handleHeaders"></param>
		/// <returns></returns>
		public async Task<Fonlow.Auth.Models.Client.AccessTokenResponse> PostRopcTokenRequestAsFormDataToAuthAsync(Fonlow.Auth.Models.Client.ROPCRequst model, Action<System.Net.Http.Headers.HttpRequestHeaders> handleHeaders = null)
		{
			var requestUri = "token";
			using var httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, requestUri);
			var pairs = new KeyValuePair<string, string>[]
						{
							new KeyValuePair<string, string>( "grant_type", model.GrantType ),
							new KeyValuePair<string, string>( "username", model.Username ),
							new KeyValuePair<string, string> ( "password", model.Password )
						};
			var content = new FormUrlEncodedContent(pairs);
			httpRequestMessage.Content = content;
			handleHeaders?.Invoke(httpRequestMessage.Headers);
			using var responseMessage = await client.SendAsync(httpRequestMessage);
			responseMessage.EnsureSuccessStatusCodeEx();
			var stream = await responseMessage.Content.ReadAsStreamAsync();
			return JsonSerializer.Deserialize<Fonlow.Auth.Models.Client.AccessTokenResponse>(stream, jsonSerializerSettings);
		}

		/// <summary>
		/// Post refresh token request as FormData to auth token endpoint
		/// </summary>
		/// <param name="model"></param>
		/// <param name="handleHeaders"></param>
		/// <returns></returns>
		public async Task<Fonlow.Auth.Models.Client.AccessTokenResponse> PostRefreshTokenRequestAsFormDataToAuthAsync(Fonlow.Auth.Models.Client.RefreshAccessTokenRequest model, Action<System.Net.Http.Headers.HttpRequestHeaders> handleHeaders = null)
		{
			var requestUri = "token";
			using var httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, requestUri);
			var pairs = new KeyValuePair<string, string>[]
						{
							new KeyValuePair<string, string>( "grant_type", model.GrantType ),
							new KeyValuePair<string, string>( "refresh_token", model.RefreshToken ),
							new KeyValuePair<string, string> ( "scope", model.Scope )
						};
			var content = new FormUrlEncodedContent(pairs);
			httpRequestMessage.Content = content;
			handleHeaders?.Invoke(httpRequestMessage.Headers);
			using var responseMessage = await client.SendAsync(httpRequestMessage);
			responseMessage.EnsureSuccessStatusCodeEx();
			var stream = await responseMessage.Content.ReadAsStreamAsync();
			return JsonSerializer.Deserialize<Fonlow.Auth.Models.Client.AccessTokenResponse>(stream, jsonSerializerSettings);
		}
	}

}
