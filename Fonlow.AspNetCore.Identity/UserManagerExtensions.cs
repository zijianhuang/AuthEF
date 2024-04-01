﻿using Microsoft.AspNetCore.Identity;

namespace Fonlow.AspNetCore.Identity
{
	/// <summary>
	/// For Microsoft.AspNetCore.Identity.UserManager.
	/// </summary>
	public static class UserManagerExtensions
	{
		/// <summary>
		/// Create user with single role. And application user consists of UserName, FulName and Email.
		/// </summary>
		/// <returns>User Id, or Guid.Empty if there's error and throwException is false.</returns>
		/// <exception cref="System.Security.SecurityException">Throws only if throwException is true and the user can not be added.</exception>
		public static async Task<Guid> CreateUser(this UserManager<ApplicationUser> userManager, string userName, string email, string fullName, string password, string roleName, bool throwException = false)
		{
			return await userManager.CreateUser(new ApplicationUser() { UserName = userName, Email = email, FullName=fullName }, password, roleName, throwException);
		}

		/// <summary>
		/// Create application user with single role.
		/// </summary>
		/// <returns>User Id, or Guid.Empty if there's error and throwException is false.</returns>
		/// <exception cref="System.Security.SecurityException">Throws only if throwException is true and the user can not be added.</exception>
		public static async Task<Guid> CreateUser(this UserManager<ApplicationUser> userManager, ApplicationUser user, string password, string roleName, bool throwException = false)
		{
			IdentityResult r = await userManager.CreateAsync(user, password);
			if (r.Succeeded)
			{
				if (String.IsNullOrEmpty(roleName))
				{
					return user.Id; // no role to create
				}

				IdentityResult rr = await userManager.AddToRoleAsync(user, roleName);
				if (rr.Succeeded)
				{
					System.Diagnostics.Trace.TraceInformation("User {0} added to role {1}.", user.UserName, roleName);
					return user.Id;
				}

				string msg = String.Format("When assigning role {0} to user {1}, errors: {2}", roleName, user.UserName, String.Join(Environment.NewLine, r.Errors));
				if (throwException)
					throw new System.Security.SecurityException(msg);

				System.Diagnostics.Trace.TraceWarning(msg);
				return Guid.Empty;
			}

			string msg2 = String.Format("When creating user {0}, errors: {1}", user.UserName, String.Join(Environment.NewLine, r.Errors));
			if (throwException)
				throw new System.Security.SecurityException(msg2);

			System.Diagnostics.Trace.TraceWarning(msg2);
			return Guid.Empty;
		}
	}

}
