using Fonlow.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Fonlow.AspNetCore.Identity.Account
{
	/// <summary>
	/// Common account management functions based on ApplicationDbContext -- IdentityDbContext<ApplicationUser, ApplicationIdentityRole, Guid, 
	/// IdentityUserClaim<Guid>, IdentityUserRole<Guid>, IdentityUserLogin<Guid>, IdentityRoleClaim<Guid>, 	ApplicationUserToken>
	/// This also overcome some inherient limitation of Identity models, and deal with the EF context directly.
	/// Applications may inherite this class for specific cases and roles.
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
		/// <param name="fullName"></param>
		/// <returns></returns>
		public Guid GetUserIdByFullName(string fullName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser us = context.Users.AsNoTracking().SingleOrDefault(d => d.FullName == fullName);
			if (us == null)
			{
				return Guid.Empty;
			}

			return us.Id;
		}

		public Guid GetUserIdByEmail(string email)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser us = context.Users.AsNoTracking().SingleOrDefault(d => d.Email == email);
			if (us == null)
			{
				return Guid.Empty;
			}

			return us.Id;
		}

		public Guid GetUserIdByUser(string username)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser us = context.Users.AsNoTracking().SingleOrDefault(d => d.UserName == username);
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
			return GetUserByUserId(userId).UserName;
		}

		public ApplicationUser GetUserByUserId(Guid userId)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser us = context.Users.AsNoTracking().SingleOrDefault(d => d.Id == userId);
			return us;
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

		/// <summary>
		/// Normalized names which are uppercase.
		/// </summary>
		/// <returns></returns>
		public string[] GetAllRoleNames(){
			using ApplicationDbContext context = new(options);
			return context.Roles.Select(d => d.NormalizedName).ToArray();
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
			ApplicationUser u = context.Users.AsNoTracking().SingleOrDefault(d => d.UserName == loginName);
			return u?.FullName;
		}

		public Guid GetId(string loginName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser u = context.Users.AsNoTracking().SingleOrDefault(d => d.UserName == loginName);
			return u.Id;
		}

		public string GetUserName(string fullName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser u = context.Users.AsNoTracking().SingleOrDefault(d => d.FullName == fullName);
			return u?.UserName;
		}

		public string GetEmailAddress(string fullName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser u = context.Users.AsNoTracking().SingleOrDefault(d => d.FullName == fullName);
			return u?.Email;
		}

		public string GetEmailAddressByUserName(string fullName)
		{
			using ApplicationDbContext context = new(options);
			ApplicationUser u = context.Users.AsNoTracking().SingleOrDefault(d => d.UserName == fullName);
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
		public async Task<bool> RemoveUserToken(Guid userId, string loginProvider, string tokenName, Guid connectionId)
		{
			string composedTokenName = $"{tokenName}_{connectionId.ToString()}";
			using ApplicationDbContext context = new(options);
			var userToken = await context.UserTokens.AsNoTracking().SingleOrDefaultAsync(d => d.UserId == userId && d.LoginProvider == loginProvider && d.Name == composedTokenName).ConfigureAwait(false);
			if (userToken != null)
			{
				context.Entry(userToken).State = EntityState.Deleted;
				await context.SaveChangesAsync().ConfigureAwait(false);
				return true;
			}

			return true;
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

		public UserItemEx[] SearchUsers(UserSearchModel conditions)
		{
			if (conditions == null)
			{
				throw new ArgumentNullException(nameof(conditions), "searrch Condition is null.");
			}

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
							user.Email,
						};



			if (!String.IsNullOrWhiteSpace(conditions.Keyword))
			{
				query = query.Where(d => EF.Functions.Like(d.UserName, "%" + conditions.Keyword + "%"));
			}

			if (conditions.DateBegin.HasValue)
			{
				DateTime date = conditions.DateBegin.Value.Date.ToUniversalTime();
				query = query.Where(d => d.CreatedUtc >= date);
			}

			if (conditions.DateEnd.HasValue)
			{
				DateTime dateEnd = conditions.DateEnd.Value.Date.AddDays(1).AddTicks(-1).ToUniversalTime();
				query = query.Where(d => d.CreatedUtc <= dateEnd);
			}

			if (!String.IsNullOrEmpty(conditions.RoleNames))
			{
				query = query.Where(d => EF.Functions.Like(conditions.RoleNames, "%" + d.RoleName + "%"));
			}

			var r = query.ToList();

			var list = from p in r // EF core could not work out this in DB, so I have better to get the list from DB first then group.
					   group p by new { p.Id, p.UserName, p.Email } into g
					   select new { Entity = g.Key, RoleNames = g.AsEnumerable().Select(d => d.RoleName) };

			var list2 = list.ToList();//query is already executed here
			IOrderedEnumerable<UserItemEx> list3 = list2.Select(d => new UserItemEx()
			{
				Id = d.Entity.Id,
				Name = d.Entity.UserName,
				Email=d.Entity.Email,
				Description = String.Join(", ", d.RoleNames.OrderBy(k=>k))
			})
				.OrderBy(d => d.Name);
			return list3.ToArray();

		}

		public IDictionary<Guid, string> GetUserIdEmailDic()
		{
			using ApplicationDbContext context = new(options);
			var q = context.Users.Select(d => new { Key = d.Id, Value = d.Email }).ToArray();
			return q.Select(d => new KeyValuePair<Guid, string>(d.Key, d.Value)).ToDictionary(p => p.Key, p => p.Value);
		}

		public IDictionary<Guid, string> GetUserIdEmailDic(Guid[] userIds)
		{
			if (userIds.Length > 0)
			{
				using ApplicationDbContext context = new(options);
				var q = context.Users.Where(u => userIds.Contains(u.Id)).Select(d => new { Key = d.Id, Value = d.Email }).ToArray();
				return q.Select(d => new KeyValuePair<Guid, string>(d.Key, d.Value)).ToDictionary(p => p.Key, p => p.Value);
			}

			return null;
		}

		public IDictionary<Guid, UserUpdate> GetUserInfoDic(Guid[] userIds)
		{
			if (userIds.Length > 0)
			{
				using ApplicationDbContext context = new(options);
				var q = context.Users.Where(u => userIds.Contains(u.Id)).Select(d => new UserUpdate
				{
					Id = d.Id,
					UserName = d.UserName,
					FullName = d.FullName,
					Email = d.Email,
				}).ToArray();
				return q.Select(d => new KeyValuePair<Guid, UserUpdate>(d.Id, d)).ToDictionary(p => p.Key, p => p.Value);
			}

			return new Dictionary<Guid, UserUpdate>();
		}

		/// <summary>
		/// Return token not yet expired
		/// </summary>
		/// <param name="user"></param>
		/// <param name="loginProvider"></param>
		/// <param name="tokenName"></param>
		/// <param name="expirySpan">The life span of the token since its created time.</param>
		/// <returns></returns>
		/// <remarks>This function is to replace the limitation of userManager.GetAuthenticationTokenAsync(user, authSettings.TokenProviderName, composedTokenName);
		/// since the UserTokens table by default has no created date. And this extended Identity model has added createdUtc to the table.
		/// </remarks>
		async Task<string> GetUserTokenValueWithExpiryAsync(ApplicationUser user, string loginProvider, string tokenName, TimeSpan expirySpan)
		{
			var r = await GetUserTokenWithExpiryAsync(user, loginProvider, tokenName, expirySpan).ConfigureAwait(false);
			return r?.Value;
		}

		async Task<ApplicationUserToken> GetUserTokenWithExpiryAsync(ApplicationUser user, string loginProvider, string tokenName, TimeSpan expirySpan)
		{
			using ApplicationDbContext context = new(options);
			var stillValidTime = (DateTime.Now - expirySpan).ToUniversalTime(); // sqlite limitations: https://learn.microsoft.com/en-us/ef/core/providers/sqlite/limitations
			var r = context.UserTokens.AsNoTracking().SingleOrDefault(d => d.UserId == user.Id && d.LoginProvider == loginProvider && d.Name == tokenName && d.CreatedUtc > stillValidTime);
			return r;
		}

		/// <summary>
		/// Lookup user tokens and find, also take care of token expiry.
		/// however, your system should have house keeping functions to regularly clean up expired refresh token, and revoke anytime for any user, selected users and all users.
		/// </summary>
		/// <param name="user"></param>
		/// <param name="purpose">token purpose</param>
		/// <param name="tokenValue"></param>
		/// <param name="connectionId">to become part of composed token name</param>
		/// <param name="expirySpan">The life span of the token since its created time.</param>
		/// <returns></returns>
		public async Task<bool> MatchTokenWithExpiry(ApplicationUser user, string loginProvider, string purpose, string tokenValue, Guid connectionId, TimeSpan expirySpan)
		{
			string composedTokenName = $"{purpose}_{connectionId.ToString()}";
			string storedToken = await GetUserTokenValueWithExpiryAsync(user, loginProvider, composedTokenName, expirySpan).ConfigureAwait(false);
			return tokenValue == storedToken;
		}

		/// <summary>
		/// UserTokens table may have multiple records for user tokens of the same user. Find the userId associated with the user token
		/// </summary>
		/// <param name="loginProvider"></param>
		/// <param name="purpose"></param>
		/// <param name="connectionId"></param>
		/// <param name="expirySpan"></param>
		/// <returns>ApplicationUser returned should not be used by UserManager for updating/deleting.</returns>
		/// <remarks>If the ApplicationUser object is returned with AsNoTracking, UserManager in the client codes may still complain: System.InvalidOperationException: The instance of entity type 'ApplicationUser' cannot be tracked because another instance with the same key value for {'Id'} is already being tracked. When attaching existing entities, ensure that only one entity instance with a given key value is attached. Consider using 'DbContextOptionsBuilder.EnableSensitiveDataLogging' to see the conflicting key values.</remarks>
		public async Task<Guid?> FindUserIdByUserToken(string loginProvider, string purpose, Guid connectionId, TimeSpan expirySpan)
		{
			using ApplicationDbContext context = new(options);
			string composedTokenName = $"{purpose}_{connectionId.ToString()}";
			var stillValidTime = (DateTime.Now - expirySpan).ToUniversalTime(); // sqlite limitations: https://learn.microsoft.com/en-us/ef/core/providers/sqlite/limitations
			var list = context.UserTokens.Where(d => d.LoginProvider == loginProvider && d.Name == composedTokenName && d.CreatedUtc > stillValidTime).OrderByDescending(d=>d.CreatedUtc);
			var first = list.AsNoTracking().FirstOrDefault();
			return first == null ? null : first.UserId;
		}
	}
}