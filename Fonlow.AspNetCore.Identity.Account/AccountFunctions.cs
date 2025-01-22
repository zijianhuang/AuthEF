using Fonlow.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Fonlow.AspNetCore.Identity.Account
{
	/// <summary>
	/// Common account management functions based on ApplicationDbContext.
	/// </summary>
	public class AccountFunctions
	{
		public AccountFunctions(DbContextOptions<ApplicationDbContext> options)
		{
			this.options = options;
		}

		readonly protected DbContextOptions<ApplicationDbContext> options;

		/// <summary>
		/// Guid.empty if not found
		/// </summary>
		/// <param name="cn"></param>
		/// <returns></returns>
		public Guid GetUserIdByFullName(string cn)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser us = context.Users.SingleOrDefault(d => d.FullName == cn);
			if (us == null)
			{
				return Guid.Empty;
			}

			return us.Id;
		}

		public Guid GetUserIdByEmail(string email)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser us = context.Users.SingleOrDefault(d => d.Email == email);
			if (us == null)
			{
				return Guid.Empty;
			}

			return us.Id;
		}

		public Guid GetUserIdByUser(string username)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser us = context.Users.SingleOrDefault(d => d.UserName == username);
			if (us == null)
			{
				return Guid.Empty;
			}

			return us.Id;
		}

		/// <summary>
		/// If not found, null
		/// </summary>
		/// <param name="userId"></param>
		/// <returns>Null if not found</returns>
		[return: System.Diagnostics.CodeAnalysis.MaybeNull]
		public string GetUserNameByUserId(Guid userId)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser us = context.Users.SingleOrDefault(d => d.Id == userId);
			if (us == null)
			{
				return null;
			}

			return us.UserName;
		}

		public KeyValuePair<string, Guid>[] GetUserIdMapByEmail()
		{
			using ApplicationDbContext context = new(options);
			var q = context.Users.Select(d => new { Key = d.Email, Value = d.Id }).ToArray();
			return q.Select(d => new KeyValuePair<string, Guid>(d.Key, d.Value)).ToArray();
		}

		public KeyValuePair<string, Guid>[] GetUserIdMapByFullName()
		{
			using ApplicationDbContext context = new(options);
			var q = context.Users.Select(d => new { Key = d.FullName, Value = d.Id }).ToArray();
			return q.Select(d => new KeyValuePair<string, Guid>(d.Key, d.Value)).ToArray();
		}

		public IDictionary<Guid, string> GetUserIdNameDic()
		{
			using ApplicationDbContext context = new(options);
			var q = context.Users.Select(d => new { Key = d.Id, Value = d.UserName }).ToArray();
			return q.Select(d => new KeyValuePair<Guid, string>(d.Key, d.Value)).ToDictionary(p => p.Key, p => p.Value);
		}

		public IDictionary<Guid, string> GetUserIdFullNameDic()
		{
			using ApplicationDbContext context = new(options);
			var q = context.Users.Select(d => new { Key = d.Id, Value = d.FullName }).ToArray();
			return q.Select(d => new KeyValuePair<Guid, string>(d.Key, d.Value)).ToDictionary(p => p.Key, p => p.Value);
		}

		public bool IsUserAccountActivated(string userName)
		{
			if (String.IsNullOrEmpty(userName))
				return false;

			using ApplicationDbContext context = new(options);
			return context.Users.Any(d => d.UserName == userName);

		}

		public int GetUserCountOfRole(string roleName)
		{
			using ApplicationDbContext context = new(options);
			var userRoleView = from userRole in context.UserRoles
							   join role in context.Roles
							   on userRole.RoleId equals role.Id
							   select new { userRole.RoleId, userRole.UserId, Rolename = role.Name };
			var query = from user in context.Users
						join userRole in userRoleView
						on user.Id equals userRole.UserId into gj
						from p in gj.DefaultIfEmpty()
						select new
						{
							user.Id,
							user.UserName,
							RoleName = p.Rolename,
							user.CreatedUtc,
							user.ModifiedUtc,
						};

			query = query.Where(d => d.RoleName == roleName);

			return query.Count();

		}

		public string[] GetAllRoleNames(){
			using ApplicationDbContext context = new(options);
			return context.Roles.Select(d => d.Name).ToArray();
		}

		/// <summary>
		/// 
		/// </summary>
		/// <returns>Id, userName, fullName</returns>
		public Tuple<Guid, string, string>[] GetAllUsers()
		{
			using ApplicationDbContext context = new(options);
			var r = context.Users.Select(d => new { d.Id, d.UserName, d.FullName }).ToArray();
			return r.Select(k => Tuple.Create<Guid, string, string>(k.Id, k.UserName, k.FullName)).ToArray();
		}

		/// <summary>
		/// Only return those with full name
		/// </summary>
		/// <param name="roleName"></param>
		/// <returns>Id, userName, fullName</returns>
		public Tuple<Guid, string, string>[] GetAllUsersOfRole(string roleName)
		{
			using ApplicationDbContext context = new(options);
			var userRoleView = from userRole in context.UserRoles
							   join role in context.Roles
							   on userRole.RoleId equals role.Id
							   select new { userRole.RoleId, userRole.UserId, Rolename = role.Name };
			var query = from user in context.Users
						join userRole in userRoleView
						on user.Id equals userRole.UserId into gj
						from p in gj.DefaultIfEmpty()
						select new
						{
							user.Id,
							user.UserName,
							user.FullName,
							RoleName = p.Rolename,
						};

			query = query.Where(d => d.RoleName == roleName);

			return query.ToArray().Where(t => !String.IsNullOrEmpty(t.FullName)).Select(k => Tuple.Create<Guid, string, string>(k.Id, k.UserName, k.FullName)).ToArray();
		}

		public string GetFullName(string loginName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser u = context.Users.SingleOrDefault(d => d.UserName == loginName);
			return u?.FullName;
		}

		public Guid GetId(string loginName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser u = context.Users.SingleOrDefault(d => d.UserName == loginName);
			return u.Id;
		}

		public string GetUserName(string fullName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser u = context.Users.SingleOrDefault(d => d.FullName == fullName);
			return u?.UserName;
		}

		public string GetEmailAddress(string fullName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser u = context.Users.SingleOrDefault(d => d.FullName == fullName);
			return u?.Email;
		}

		public string GetEmailAddressByUserName(string fullName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser u = context.Users.SingleOrDefault(d => d.UserName == fullName);
			return u?.Email;
		}

		/// <summary>
		/// Remove tokens created before pastDateUtc. Such house keeping should be carried out by admin only.
		/// </summary>
		/// <param name="pastDateUtc"></param>
		/// <returns>Total number deleted.</returns>
		public async Task<int> RemoveOldUserTokens(DateTime pastDateUtc)
		{
			using ApplicationDbContext context = new(options);
			return await context.UserTokens.Where(d => d.CreatedUtc <= pastDateUtc).ExecuteDeleteAsync().ConfigureAwait(false);
		}

		/// <summary>
		/// Expected to be called when a user signs out from a device.
		/// </summary>
		public async Task RemoveUserToken(Guid userId, string loginProvider, string tokenName, Guid connectionId)
		{
			string composedTokenName = $"{tokenName}_{connectionId.ToString("N")}";
			using ApplicationDbContext context = new(options);
			var userToken = await context.UserTokens.SingleOrDefaultAsync(d => d.UserId == userId && d.LoginProvider == loginProvider && d.Name == composedTokenName).ConfigureAwait(false);
			if (userToken != null)
			{
				context.Entry(userToken).State = EntityState.Deleted;
				await context.SaveChangesAsync().ConfigureAwait(false);
			}
		}

		/// <summary>
		/// Typically called by admin or the user (depending on your security policy as vendor) to force the user to login again since all refresh tokens of all user connections are removed.
		/// </summary>
		/// <returns>Total removed</returns>
		public async Task<int> RemoveTokensOfUser(Guid userId, string loginProvider, string tokenName)
		{
			using ApplicationDbContext context = new(options);
			return await context.UserTokens.Where(d => d.UserId == userId && d.LoginProvider == loginProvider && d.Name.StartsWith(tokenName)).ExecuteDeleteAsync().ConfigureAwait(false);
		}


	}
}