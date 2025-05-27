using DemoApp.Accounts;
using DemoWebApi.DemoData;
using Fonlow.AspNetCore.Identity;
using Fonlow.AspNetCore.Identity.EntityFrameworkCore;
using Fonlow.CodeDom.Web;
using Fonlow.WebApp.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Threading.Tasks;

namespace Fonlow.Auth.Controllers
{
	/// <summary>
	/// Manage user accounts stored in ASP.NET Core Identity database.
	/// </summary>
	/// <remarks>Majorty of the codes were originally from ASP.NET MVC scarfolding codes with slight modification for ASP.NET Core Web API. And it is not a universal solution for real worlds scenarios. Please consult with IT security guys.</remarks>
	[Route("api/[controller]")]
	public class AccountController : AccountControllerBase
	{
		public AccountController(ApplicationUserManager userManager, DbContextOptions<ApplicationDbContext> options, IAuthSettings authSettings, [FromKeyedServices("NotValidateLifetime")] TokenValidationParameters tokenValidationParameters,
		ILogger<WebApiTrace> apiLogger) : base(userManager, options, authSettings, tokenValidationParameters, apiLogger)
		{

		}

		protected override string GetAdminRoleName()
		{
			return RoleConstants.Admin;
		}

		/// <summary>
		/// : InternalRoles
		/// </summary>
		/// <returns></returns>
		[Authorize(Roles = RoleConstants.Admin)]
		public override async Task<UserInfoViewModel> GetUserInfo()
		{
			return await base.GetUserInfo();
		}

		/// <summary>
		/// : Admin
		/// </summary>
		/// <param name="model"></param>
		/// <returns></returns>
		/// <exception cref="AppArgumentException"></exception>
		[Authorize(Roles = RoleConstants.Admin)]
		public override async Task<IActionResult> SetPassword([FromBody] SetPasswordBindingModel model)
		{
			return await base.SetPassword(model);
		}

		/// <summary>
		/// Create user, but without role
		/// </summary>
		/// <param name="model"></param>
		/// <returns></returns>
		[Authorize(Roles = RoleConstants.Admin)]
		public override async Task<ActionResult<Guid>> Register([FromBody] RegisterBindingModel model)
		{
			return await base.Register(model);
		}


		[Authorize(Roles = RoleConstants.Admin)]
		public override async Task<IActionResult> AddRole([FromQuery] Guid userId, [RequiredFromQuery] string roleName)
		{
			return await base.AddRole(userId, roleName);

		}

		[Authorize(Roles = RoleConstants.Admin)]
		public override async Task<IActionResult> RemoveRole([FromQuery] Guid userId, [RequiredFromQuery] string roleName)
		{
			return await base.RemoveRole(userId, roleName);
		}


		/// <summary>
		/// Admin or scheduler clean up old user tokens
		/// </summary>
		/// <param name="pastDateUtc"></param>
		/// <returns></returns>
		[Authorize(Roles = RoleConstants.Admin)]
		public override async Task<int> RemoveOldUserTokens(DateTime pastDateUtc)
		{
			return await base.RemoveOldUserTokens(pastDateUtc);
		}


		[Authorize(Roles = RoleConstants.Admin)]
		public override async Task<int> AdminRemoverRefreshTokensOfUsers(string username)
		{
			return await base.AdminRemoverRefreshTokensOfUsers(username);
		}

		[Authorize(Roles = RoleConstants.Admin)]
		public override UserItemEx[] Search([FromBody] UserSearchModel c)
		{
			return base.Search(c);
		}

		[Authorize(Roles = RoleConstants.Admin)]
		public override Task<IActionResult> RemoveUser([FromQuery] Guid userId)
		{
			return base.RemoveUser(userId);
		}

		protected override Task<IActionResult> DeliverResetLink(string emailAddress, string callbackUrl)
		{
			throw new NotImplementedException();
		}
	}
}
