using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Fonlow.Auth
{
	/// <summary>
	/// Client codes to provide HttpClient object to make auth calls for tokens.
	/// </summary>
	public class AuthClient
	{
		readonly System.Net.Http.HttpClient client;

		readonly JsonSerializerOptions jsonSerializerSettings;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="client"></param>
		/// <param name="jsonSerializerSettings">Client codes to determine how to deserialize JWT returned by the auth server. In most cases, null is OK.</param>
		/// <exception cref="ArgumentNullException"></exception>
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
		public async Task<Fonlow.Auth.Models.AccessTokenResponse> PostRopcTokenRequestAsFormDataToAuthAsync(Fonlow.Auth.Models.ROPCRequst model, Action<System.Net.Http.Headers.HttpRequestHeaders> handleHeaders = null)
		{
			var requestUri = "token";
			using var httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, requestUri);
			var pairs = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>( "grant_type", model.grant_type ),
							new KeyValuePair<string, string>( "username", model.Username ),
							new KeyValuePair<string, string> ( "password", model.Password )
						};

			if (!string.IsNullOrEmpty(model.Scope))
			{
				pairs.Add(new KeyValuePair<string, string>("scope", model.Scope));
			}

			var content = new FormUrlEncodedContent(pairs);
			httpRequestMessage.Content = content;
			handleHeaders?.Invoke(httpRequestMessage.Headers);
			using var responseMessage = await client.SendAsync(httpRequestMessage).ConfigureAwait(false);
			responseMessage.EnsureSuccessStatusCodeEx();
			var stream = await responseMessage.Content.ReadAsStreamAsync().ConfigureAwait(false);
			return await JsonSerializer.DeserializeAsync<Fonlow.Auth.Models.AccessTokenResponse>(stream, jsonSerializerSettings).ConfigureAwait(false);
		}

		/// <summary>
		/// Post refresh token request as FormData to auth token endpoint
		/// </summary>
		/// <param name="model"></param>
		/// <param name="handleHeaders"></param>
		/// <returns></returns>
		public async Task<Fonlow.Auth.Models.AccessTokenResponse> PostRefreshTokenRequestAsFormDataToAuthAsync(Fonlow.Auth.Models.RefreshAccessTokenRequest model, Action<System.Net.Http.Headers.HttpRequestHeaders> handleHeaders = null)
		{
			var requestUri = "token";
			using var httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, requestUri);
			var pairs = new List<KeyValuePair<string, string>>
						{
							new KeyValuePair<string, string>( "grant_type", model.grant_type ),
							new KeyValuePair<string, string>( "refresh_token", model.refresh_token ),
						};


			if (!string.IsNullOrEmpty(model.Scope))
			{
				pairs.Add(new KeyValuePair<string, string>("scope", model.Scope));
			}

			var content = new FormUrlEncodedContent(pairs);
			httpRequestMessage.Content = content;
			handleHeaders?.Invoke(httpRequestMessage.Headers);
			using var responseMessage = await client.SendAsync(httpRequestMessage).ConfigureAwait(false);
			responseMessage.EnsureSuccessStatusCodeEx();
			var stream = await responseMessage.Content.ReadAsStreamAsync().ConfigureAwait(false);
			return  await JsonSerializer.DeserializeAsync<Fonlow.Auth.Models.AccessTokenResponse>(stream, jsonSerializerSettings).ConfigureAwait(false);
		}
	}

#pragma warning disable CA1032 // Implement standard exception constructors
	public class WebApiRequestException : HttpRequestException
#pragma warning restore CA1032 // Implement standard exception constructors
	{
		public new System.Net.HttpStatusCode StatusCode { get; private set; }

		public string Response { get; private set; }

		public System.Net.Http.Headers.HttpResponseHeaders Headers { get; private set; }

		public System.Net.Http.Headers.MediaTypeHeaderValue ContentType { get; private set; }

		public WebApiRequestException(string message, System.Net.HttpStatusCode statusCode, string response, System.Net.Http.Headers.HttpResponseHeaders headers, System.Net.Http.Headers.MediaTypeHeaderValue contentType) : base(message)
		{
			StatusCode = statusCode;
			Response = response;
			Headers = headers;
			ContentType = contentType;
		}
	}

	internal static class ResponseMessageExtensions
	{
		public static void EnsureSuccessStatusCodeEx(this HttpResponseMessage responseMessage)
		{
			if (!responseMessage.IsSuccessStatusCode)
			{
				var responseText = responseMessage.Content.ReadAsStringAsync().Result;
				var contentType = responseMessage.Content.Headers.ContentType;
				throw new WebApiRequestException(responseMessage.ReasonPhrase, responseMessage.StatusCode, responseText, responseMessage.Headers, contentType);
			}
		}
	}

}
