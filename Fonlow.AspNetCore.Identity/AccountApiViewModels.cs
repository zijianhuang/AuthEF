using System.Runtime.Serialization;

namespace Fonlow.AspNetCore.Identity
{
	// Models returned by AccountController actions.

	[DataContract]
	public class ExternalLoginViewModel
	{
		[DataMember]
		public string Name { get; set; }

		[DataMember]
#pragma warning disable CA1056 // URI-like properties should not be strings
		public string Url { get; set; }
#pragma warning restore CA1056 // URI-like properties should not be strings

		[DataMember]
		public string State { get; set; }
	}

	[DataContract]
	public class ManageInfoViewModel
	{
		[DataMember]
		public string LocalLoginProvider { get; set; }

		[DataMember]
		public string Email { get; set; }

		[DataMember]
		public IEnumerable<UserLoginInfoViewModel> Logins { get; set; }

		[DataMember]
		public IEnumerable<ExternalLoginViewModel> ExternalLoginProviders { get; set; }
	}

	[DataContract]
	public class UserInfoViewModel
	{
		[DataMember(IsRequired = true)]
		public Guid Id { get; set; }

		[DataMember(IsRequired = true)]
		public string UserName { get; set; }

		[DataMember]
		public string FullName { get; set; }

		[DataMember]
		public string Email { get; set; }

		[DataMember]
		public bool HasRegistered { get; set; }

		[DataMember]
		public string LoginProvider { get; set; }

		[DataMember]
		public IReadOnlyCollection<string> Roles { get; set; }

		[DataMember]
		public DateTime CreatedUtc { get; set; }
	}

	[DataContract]
	public class UserLoginInfoViewModel
	{
		[DataMember]
		public string LoginProvider { get; set; }

		[DataMember]
		public string ProviderKey { get; set; }
	}

	[DataContract]
	public class ResetPasswordViewModel
	{
		[DataMember]
		public string Email { get; set; }

		[DataMember]
		public string Password { get; set; }

		[DataMember]
		public string ConfirmPassword { get; set; }

		[DataMember]
		public string Code { get; set; }
	}

	[DataContract]
	public class ApiKey
	{
		[DataMember]
		public string Key { get; set; }

		/// <summary>
		/// Tell the client about expiration
		/// </summary>
		[DataMember]
		public DateTimeOffset ExpiryTime { get; set; }
	}

	[DataContract]
	public class EntitySearchModel
	{
		[DataMember]
		public string Keyword { get; set; }

		[DataMember]
		public DateTime? DateBegin { get; set; }

		[DataMember]
		public DateTime? DateEnd { get; set; }

	}


	[DataContract]
	public class UserSearchModel : EntitySearchModel
	{
		[DataMember]
		public string RoleNames { get; set; }
	}

	[DataContract]
	public class UserLookupItem
	{
		[DataMember(IsRequired = true)]
		public Guid Id { get; set; }

		[DataMember]
		public string UserName { get; set; }

		[DataMember]
		public string FullName { get; set; }

	}

	[DataContract]
	public class UserItem
	{
		[DataMember(IsRequired = true)]
		public Guid Id { get; set; }

		[DataMember]
		public string Name { get; set; }

		[DataMember]
		public string Description { get; set; }

	}

	[DataContract]
	public class UserItemEx : UserItem
	{
		[DataMember]
		public string Email { get; set; }
	}

	[DataContract]
	public class UserUpdate
	{
		[DataMember]
		public Guid Id { get; set; }

		[DataMember]
		public string UserName { get; set; }

		[DataMember]
		public string Email { get; set; }

		[DataMember]
		public string FullName { get; set; }

	}
}
