using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Fonlow.WebApp.Accounts
{
	/// <summary>
	/// https://datatracker.ietf.org/doc/html/rfc7519 JWT
	/// https://www.ietf.org/rfc/rfc6749.txt, The OAuth 2.0 Authorization Framework
	/// </summary>
	/// <remarks>The controller has better to be using AddNewtonsoftJson to horner DataMemberAttribute. .NET Core apparently like JsonPropertyNameAttribute more.</remarks>
	[DataContract]
	public class TokenResponseModel
	{
		[JsonPropertyName("access_token")]
		[DataMember(Name = "access_token", IsRequired = true)]
		public string AccessToken { get; set; }

		[JsonPropertyName("token_type")]
		[DataMember(Name = "token_type", IsRequired = true)]
		public string TokenType { get; set; }

		[JsonPropertyName("expires_in")]
		[DataMember(Name = "expires_in", IsRequired = true)]
		public int ExpiresIn { get; set; }

		[JsonPropertyName("username")]
		[DataMember(Name = "username", IsRequired = true)]
		public string Username { get; set; }

		//[DataMember(Name = "issued", IsRequired = true)]
		//public string Issued { get; set; }

		/// <summary>
		/// For human readable. The app codes generaly use expires_in
		/// </summary>
		[JsonPropertyName("expires")]
		[DataMember(Name = "expires", IsRequired = true)]
		public string Expires { get; set; }

		[JsonPropertyName("refresh_token")]
		[DataMember(Name = "refresh_token")]
		public string RefreshToken { get; set; }

		[JsonPropertyName("scope")]
		[DataMember(Name = "scope")]
		public string Scope { get; set; }

		[JsonPropertyName("state")]
		[DataMember(Name = "state")]
		public string State {get;set;}

		/// <summary>
		/// Custom
		/// </summary>
		[JsonPropertyName("connection_id")]
		[DataMember(Name = "connection_id")]
		public Guid ConnectionId { get; set; }
	}

	[DataContract]
	public class CustomToken
	{
		[DataMember]
		public string TokenValue { get; set; }

		[DataMember]
		public Guid ConnectionId { get; set; }

		[DataMember]
		public DateTimeOffset Stamp { get; set; }
	}
}
