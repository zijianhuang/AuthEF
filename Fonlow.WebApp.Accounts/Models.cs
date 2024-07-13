using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Fonlow.Auth.Models
{
	// Data contract attbibutes are basically for NewtonSoft.Json which respects these attributes
	//[JsonPolymorphic(TypeDiscriminatorPropertyName = "grant_type")]
	//[JsonDerivedType(typeof(ROPCRequst), "password")]
	//[JsonDerivedType(typeof(RefreshAccessTokenRequest), "refresh_token")]
	[DataContract]
	public class RequestBase
	{
		[Required]
		[JsonPropertyName("grant_type")]
		[JsonPropertyOrder(-10)]
		[DataMember(Name = "grant_type")]
		public string grant_type { get; protected set; }
	}

	/// <summary>
	/// Section 4.3 and 4.3.2.
	/// GrantType must be Value MUST be set to "password".
	/// </summary>
	[DataContract]
	public class ROPCRequst : RequestBase
	{
		public ROPCRequst()
		{
			grant_type = "password";
		}

		[Required]
		[DataMember]
		public string Username { get; set; }

		[Required]
		[DataMember]
		public string Password { get; set; }

		[DataMember]
		public string Scope { get; set; }

	}

	/// <summary>
	/// Section 6
	/// Grant type MUST be set to "refresh_token".
	/// </summary>
	[DataContract]
	public class RefreshAccessTokenRequest : RequestBase
	{
		public RefreshAccessTokenRequest()
		{
			grant_type = "refresh_token";
		}

		[Required]
		[JsonPropertyName("refresh_token")]
		[DataMember(Name = "refresh_token")]
		public string refresh_token { get; set; }

		[DataMember]
		public string Scope { get; set; }
	}

	[DataContract]
	public abstract class TokenResponseBase
	{
		/// <summary>
		/// Such as bearer or Bearer
		/// </summary>
		[Required]
		[JsonPropertyOrder(-10)]
		[JsonPropertyName("token_type")]
		[DataMember(Name = "token_type")]
		public string token_type { get; set; }
	}

	/// <summary>
	/// Section 5.1
	/// </summary>
	[DataContract]
	public class AccessTokenResponse : TokenResponseBase
	{
		[JsonPropertyName("access_token")]
		[DataMember(Name = "access_token")]
		[Required]
		public string access_token { get; set; }

		/// <summary>
		/// In the spec, it is recommended, however, it is bad in practice if not required.
		/// </summary>
		[JsonPropertyName("expires_in")]
		[DataMember(Name = "expires_in")]
		[Required]
		public int expires_in { get; set; }

		[JsonPropertyName("refresh_token")]
		[DataMember(Name = "refresh_token")]
		public string refresh_token { get; set; }

		[DataMember]
		public string Scope { get; set; }
	}

}
