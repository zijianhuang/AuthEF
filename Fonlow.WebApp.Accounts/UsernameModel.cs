
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Fonlow.WebApp.Accounts
{
	/// <summary>
	/// https://datatracker.ietf.org/doc/html/rfc7519 JWT
	/// https://www.ietf.org/rfc/rfc6749.txt, The OAuth 2.0 Authorization Framework
	/// </summary>
	[DataContract]
	public class TokenResponseModel : Fonlow.Auth.Models.AccessTokenResponse
	{
		//[JsonPropertyName("username")]
		//[DataMember]
		//[Required]
		//public string Username { get; set; }


		///// <summary>
		///// For human readable. The app codes generaly use expires_in
		///// </summary>
		//[JsonPropertyName("expires")]
		//[DataMember]
		//[Required]
		//public string Expires { get; set; }

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
