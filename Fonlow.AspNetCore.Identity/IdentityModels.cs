using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Fonlow.AspNetCore.Identity
{
	/// <summary>
	/// Mapped to DB table aspnetroles
	/// </summary>
	public class ApplicationIdentityRole : IdentityRole<Guid>
	{
		public ApplicationIdentityRole()
		{
			Id = Guid.NewGuid();
		}

		public ApplicationIdentityRole(string roleName) : this()
		{
			Name = roleName;
		}
	}

	/// <summary>
	/// Mapped to table aspnetusers
	/// </summary>
	public class ApplicationUser : IdentityUser<Guid>, ITrackableEntity
	{
		/// <summary>
		/// Full name of the user. And this could be used as a filter or logical foreight key with a user.
		/// </summary>
		[MaxLength(128)]
		public string FullName { get; set; }

		public DateTime CreatedUtc { get; set; }

		public DateTime ModifiedUtc { get; set; }
	}

	public class ApplicationUserToken : IdentityUserToken<Guid>, INewEntity
	{
		public DateTime CreatedUtc { get; set; }
	}

	public interface INewEntity{
		DateTime CreatedUtc { get; set; }
	}

	/// <summary>
	/// Give EF context a hint to update time stamps when SaveChanges(). A wholesale way of updating such columns.
	/// </summary>
	public interface ITrackableEntity : INewEntity
	{
		DateTime ModifiedUtc { get; set; }
	}
}