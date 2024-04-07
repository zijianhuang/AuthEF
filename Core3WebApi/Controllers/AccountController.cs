using DemoApp.Accounts;
using Fonlow.AspNetCore.Identity;
using Fonlow.AspNetCore.Identity.Account;
using Fonlow.AspNetCore.Identity.EntityFrameworkCore;
using Fonlow.DemoApp;
using Fonlow.WebApp.Accounts;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using DemoWebApi.DemoData;
using Fonlow.WebApp.Identity;

namespace DemoWebApi.Controllers
{
	/// <summary>
	/// Manage user accounts stored in ASP.NET Core Identity database.
	/// </summary>
	/// <remarks>Majorty of the codes were originally from ASP.NET MVC scarfolding codes with slight modification for ASP.NET Core Web API. And it is not a universal solution for real worlds scenarios. Please consult with IT security guys.</remarks>
	[Authorize(AuthenticationSchemes = ApiConstants.DefaultAuthenticationScheme)]
	[Route("api/[controller]")]
	public class AccountController : ControllerBase
	{
		readonly DbContextOptions<ApplicationDbContext> options;
		readonly AccountFunctions accountFunctions;
		readonly IAuthSettings authSettings;

		readonly ILogger houseKeepingLogger;
		readonly ILogger apiLogger;

		public AccountController(ApplicationUserManager userManager, DbContextOptions<ApplicationDbContext> options, IAuthSettings authSettings,
		ILogger<HouseKeepingTrace> houseKeepingLogger, ILogger<WebApiTrace> apiLogger)
		{
			UserManager = userManager;
			this.authSettings = authSettings;
			this.houseKeepingLogger = houseKeepingLogger;
			this.apiLogger = apiLogger;
			this.options = options;
			accountFunctions = new AccountFunctions(options);
		}

		public ApplicationUserManager UserManager
		{
			get; private set;
		}

		///// <summary>
		///// Get user info of current logged user
		///// </summary>
		///// <returns></returns>
		//[Authorize(AuthenticationSchemes = "ExternalBearer")]
		[HttpGet("UserInfo")]
		public async Task<UserInfoViewModel> GetUserInfo()
		{
			ApplicationUser applicationUser = await UserManager.FindByNameAsync(User.Identity.Name);//todo: not working: .GetUserAsync(User);
			IList<string> roleNames = await UserManager.GetRolesAsync(applicationUser);
			var userId = applicationUser.Id;
			return new UserInfoViewModel
			{
				Id = userId,
				Email = applicationUser.Email,
				UserName = applicationUser.UserName,
				HasRegistered = true,
				LoginProvider = null,
				Roles = roleNames.ToArray(),
				FullName = applicationUser.FullName,
				CreatedUtc = applicationUser.CreatedUtc,
			};

		}

		[HttpGet("idByFullName")]
		public Guid GetUserIdByFullName([FromQuery] string cn)
		{
			return accountFunctions.GetUserIdByFullName(cn);
		}

		[HttpGet("idByEmail")]
		public Guid GetUserIdByEmail([FromQuery] string email)
		{
			return accountFunctions.GetUserIdByEmail(email);
		}

		/// <summary>
		/// Mapping between full user name and user Id
		/// </summary>
		/// <returns>Key is full name, and value is user Id.</returns>
		[HttpGet("UserIdMapByFullName")]
		public KeyValuePair<string, Guid>[] GetUserIdMapByFullName()
		{
			return accountFunctions.GetUserIdMapByFullName();
		}

		/// <summary>
		/// Mapping between email address and user Id
		/// </summary>
		/// <returns>Key is email address, and value is user Id.</returns>
		[HttpGet("UserIdMapByEmail")]
		public KeyValuePair<string, Guid>[] GetUserIdMapByEmail()
		{
			return accountFunctions.GetUserIdMapByEmail();
		}

		[HttpGet("UserIdNameDic")]
		public IDictionary<Guid, string> GetUserIdNameDic()
		{
			return accountFunctions.GetUserIdNameDic();
		}

		[HttpGet("UserIdFullNameDic")]
		public IDictionary<Guid, string> GetUserIdFullNameDic()
		{
			return accountFunctions.GetUserIdFullNameDic();
		}

		/// <summary>
		/// Get user info of a user ID.
		/// </summary>
		/// <param name="userId"></param>
		/// <returns></returns>
		UserInfoViewModel GetUserInfoViewModel(Guid userId)
		{
			//using (var context = new ApplicationDbContext())
			//using (var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context), null, null, null, null, null, null, null, null))
			{
				ApplicationUser user = UserManager.FindByIdAsync(userId).Result;
				string[] roleNames = UserManager.GetRolesAsync(user).Result.ToArray();

				return new UserInfoViewModel
				{
					Id = userId,
					Email = user.Email,
					UserName = user.UserName,
					HasRegistered = true,
					LoginProvider = null,
					Roles = roleNames,
					FullName = user.FullName,
					CreatedUtc = user.CreatedUtc,
				};

			}
		}

		[HttpGet("UserInfoById")]
		public UserInfoViewModel GetUserInfo([FromQuery] Guid id)
		{
			return GetUserInfoViewModel(id);
		}

		/// <summary>
		/// Clear the existing external cookie to ensure a clean login process
		/// and a little house keeping to remove refresh token
		/// </summary>
		/// <returns></returns>
		/// <remarks>Technically it is possible John on iPHone removes user refresh token of the same John on Android phone if John use the connectionId on Android. However, apparently this is not a big deal.</remarks>
		[HttpPost("Logout/{connectionId}")]
		public async Task<IActionResult> Logout(Guid connectionId)
		{
			// https://learn.microsoft.com/en-us/aspnet/core/migration/1x-to-2x/identity-2x#use-httpcontext-authentication-extensions
			await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

			ApplicationUser currentUser = await UserManager.FindByNameAsync(User.Identity.Name);
			await accountFunctions.RemoveUserToken(currentUser.Id, authSettings.TokenProviderName, "RefreshToken", connectionId);
			return StatusCode((int)HttpStatusCode.NoContent);
		}

		[HttpPut("ChangePassword")]
		public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ApplicationUser applicationUser = await UserManager.FindByNameAsync(User.Identity.Name);

			IdentityResult result = await UserManager.ChangePasswordAsync(applicationUser, model.OldPassword,
				model.NewPassword);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return StatusCode((int)HttpStatusCode.NoContent);
		}

		// POST api/Account/SetPassword
		[HttpPut("SetPassword")]
		public async Task<IActionResult> SetPassword([FromBody] SetPasswordBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ApplicationUser applicationUser = await UserManager.FindByNameAsync(User.Identity.Name);
			IdentityResult result = await UserManager.AddPasswordAsync(applicationUser, model.NewPassword);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return StatusCode((int)HttpStatusCode.NoContent);
		}

		// POST api/Account/SetPassword
		[Authorize(Roles = RoleConstants.Admin)]
		[HttpPut("SetUserPassword")]
		public async Task<IActionResult> SetUserPassword([FromBody] SetUserPasswordBindingModel model)
		{
			if (model.NewPassword != model.ConfirmPassword)
				throw new AppArgumentException("Passwords mismached.");

			ApplicationUser applicationUser = await UserManager.FindByIdAsync(model.UserId);

			IdentityResult pwdValidateResult = await UserManager.PasswordValidators.First().ValidateAsync(UserManager, applicationUser, model.NewPassword);
			if (!pwdValidateResult.Succeeded)
			{
				return GetErrorResult(pwdValidateResult);
			}

			if (applicationUser == null)
			{
				return NotFound();
			}
			applicationUser.PasswordHash = UserManager.PasswordHasher.HashPassword(applicationUser, model.NewPassword);
			IdentityResult result = await UserManager.UpdateAsync(applicationUser);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return StatusCode((int)HttpStatusCode.NoContent);
		}

		[HttpDelete("RemoveUser")]
		public async Task<IActionResult> RemoveUser([FromQuery] Guid userId)
		{
			ApplicationUser currentUser = await UserManager.FindByNameAsync(User.Identity.Name);
			var currentUserId = currentUser.Id;

			if (userId == currentUserId)
			{
				Debug.WriteLine("Attempted to delete self.");
				ModelState.AddModelError("NotAllowedDeleteSelf", "Not allowed to delete self.");
				return BadRequest(ModelState);
			}

			try
			{
				ApplicationUser user = await UserManager.FindByIdAsync(userId);
				if (user == null)
				{
					houseKeepingLogger.LogWarning("User {0} not found, so it can't be deleted.", userId);
					return StatusCode((int)HttpStatusCode.NoContent);
				}

				IList<string> roleNames = await UserManager.GetRolesAsync(user);
				bool isAdmin = roleNames.Contains(RoleConstants.Admin);
				if (isAdmin)
				{
					if (accountFunctions.GetUserCountOfRole(RoleConstants.Admin) == 1)
					{
						ModelState.AddModelError("LastAdmin", "Last admin account.");
						return BadRequest(ModelState);
					}
				}

				await UserManager.RemoveFromRolesAsync(user, roleNames.ToArray());//because of the foreigh key constraints, need to remove roles first.
																				  //this is part of the fix against some bugs in Identity 2.1

				IdentityResult result = await UserManager.DeleteAsync(user);
				if (!result.Succeeded)
				{
					return GetErrorResult(result);
				}

				return StatusCode((int)HttpStatusCode.NoContent);


			}
			catch (Exception ex)
			{
				houseKeepingLogger.LogError($"Cannot delete user: {ex}");
				throw;
			}

		}

		[Authorize(Roles = RoleConstants.AdminOrManager)]
		[HttpPost("Register")]
		public async Task<ActionResult<Guid>> Register([FromBody] RegisterBindingModel model)
		{
			Debug.WriteLine($"Register user: {model.UserName}, fullName: {model.FullName}, email: {model.Email}");
			if (!ModelState.IsValid)//Though not explicitly verify in codes, ConfirmPassword is verified apparently by the runtime.
			{
				houseKeepingLogger.LogWarning("Bad request. Why?");
				return new BadRequestObjectResult("ModelState");
			}

			ApplicationUser user = new() { UserName = model.UserName, Email = model.Email, FullName = model.FullName };

			IdentityResult result = await UserManager.CreateAsync(user, model.Password);

			if (!result.Succeeded)
			{
				string errors = String.Join(Environment.NewLine, result.Errors);
				houseKeepingLogger.LogError(errors);
				return new BadRequestObjectResult("NotGood");
			}

			ApplicationUser u = await UserManager.FindByNameAsync(user.UserName);
			var id = u.Id;
			return id;
		}

		[HttpPost("AddRole")]
		public async Task<IActionResult> AddRole([FromQuery] string userId, [FromQuery] string roleName)
		{
			bool toAddAdmin = roleName.Equals(RoleConstants.Admin, StringComparison.CurrentCultureIgnoreCase);
			bool currentUserIsNotAdmin = !User.IsInRole(RoleConstants.Admin);
			if (toAddAdmin && currentUserIsNotAdmin)
			{
				return new BadRequestObjectResult("OnlyAdmin");
			}

			var roleNames = accountFunctions.GetAllRoleNames();

			bool roleNameIsValid = roleNames.Any(d => d == roleName);
			if (!roleNameIsValid)
			{
				return new BadRequestObjectResult("BadRole");
			}

			ApplicationUser user = await UserManager.FindByIdAsync(userId);
			IdentityResult result = await UserManager.AddToRoleAsync(user, roleName);
			if (result.Succeeded)
			{
				apiLogger.LogInformation(String.Format("added role {0}", roleName));
				return StatusCode((int)HttpStatusCode.NoContent);
			}
			else
			{
				return GetErrorResult(result);
			}

		}

		[HttpDelete("RemoveRole")]
		public async Task<IActionResult> RemoveRole([FromQuery] string userId, [FromQuery] string roleName)
		{
			if (roleName.Equals(RoleConstants.Admin, StringComparison.CurrentCultureIgnoreCase)
				&& (!User.IsInRole(RoleConstants.Admin)))
			{
				houseKeepingLogger.LogWarning("Only admin could remove role.");
				return new BadRequestResult();
				//throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.BadRequest) { ReasonPhrase = "OnlyAdmin" });
			}


			ApplicationUser user = await UserManager.FindByIdAsync(userId);

			IdentityResult result = await UserManager.RemoveFromRoleAsync(user, roleName);
			if (result.Succeeded)
			{
				apiLogger.LogInformation(String.Format("removed role {0}", roleName));
				return StatusCode((int)HttpStatusCode.NoContent);
			}
			else
			{
				LogIdentityResultErrors(result);
				return StatusCode((int)HttpStatusCode.NoContent);//Yes, keep quiet.
			}
		}

		[HttpGet("AllRoleNames")]
		public string[] GetAllRoleNames()
		{
			return accountFunctions.GetAllRoleNames();
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="userId"></param>
		/// <returns></returns>
		/// <remarks>System.InvalidOperationException: UserId not found. But this function will just return empty array.</remarks>
		[HttpGet("Roles")]
		public async Task<string[]> GetRoles([FromQuery] string userId)
		{
			try
			{
				ApplicationUser user = await UserManager.FindByIdAsync(userId);
				if (user == null)
				{
					throw new ArgumentException("userId does not indicate an existing user.");
				}

				IList<string> r = await UserManager.GetRolesAsync(user);
				return r.ToArray();

			}
			catch (InvalidOperationException ex)
			{
				houseKeepingLogger.LogWarning(ex.Message);
				return Array.Empty<string>();
			}
		}

		/// <summary>
		/// 
		/// </summary>
		/// <returns></returns>
		[AllowAnonymous]
		[HttpPost("ForgotPassword")]
		public async Task<IActionResult> ForgotPassword([FromBody] string email)
		{
			if (ModelState.IsValid)
			{
				ApplicationUser user = await UserManager.FindByEmailAsync(email);
				if (user == null)// || !(await UserManager.IsEmailConfirmedAsync(user.Id))) the default is to confirm Email, not sure BM would like it
				{
					// Don't reveal that the user does not exist or is not confirmed
					return StatusCode((int)HttpStatusCode.NoContent);
				}

				// For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=320771
				// Send an email with this link
				string code = await UserManager.GeneratePasswordResetTokenAsync(user);
				Debug.WriteLine("Reset code is : " + code);
				//var requestUrl = new Uri(Request.GetDisplayUrl());
				//var requestHostUri = new Uri(requestUrl.Host);
				var uiHost = Request.Headers["origin"];
				var requestHostUri = new Uri(uiHost);
				string resetQuery = $"resetpassword?userId={user.Id}&code={Uri.EscapeDataString(code)}";

				Uri resetUri = new(requestHostUri, resetQuery);
				string callbackUrl = resetUri.ToString();
				Debug.WriteLine("Reset uri is: " + callbackUrl);
				try
				{
					//	string emailAddress = await UserManager.GetEmailAsync(user);
					//	using var message = new System.Net.Mail.MailMessage(sender.From, emailAddress)
					//	{
					//		Subject = "Reset Password for Medilink's Web applications",
					//		Body = "<p>Please reset your password by clicking the link<a href=\"" + callbackUrl + "\"> here</a>, and you will be prompted to input the Email address associated with your account.</p>" +
					//"<p>If your Email program or Web browser blocks such link, you may copy and paste the link below to the Web browser's address bar.</p><pre>" +
					//callbackUrl + "</pre>",
					//		IsBodyHtml = true
					//	};

					//	await sender.SendAsync(message);
				}
				catch (InvalidOperationException ex)
				{
					houseKeepingLogger.LogError(ex.ToString());
				}
				catch (System.Net.Mail.SmtpException ex)
				{
					houseKeepingLogger.LogError(ex.ToString());
					throw new AppException($"Not able to send password reset link, because {ex.Message}");
				}

				return StatusCode((int)HttpStatusCode.NoContent);
			}

			// If we got this far, something failed, redisplay form
			return StatusCode((int)HttpStatusCode.NoContent);
		}

		[AllowAnonymous]
		[HttpPost("ResetPassword")]
		public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model)
		{
			if (!ModelState.IsValid)
			{
				return StatusCode((int)HttpStatusCode.BadRequest);
			}
			ApplicationUser user = await UserManager.FindByEmailAsync(model.Email);
			if (user == null)
			{
				// Don't reveal that the user does not exist
				return StatusCode((int)HttpStatusCode.NoContent);
			}

			Debug.WriteLine($"userId: {user.Id} password: {model.Password} code: {model.Code}");
			IdentityResult result = await UserManager.ResetPasswordAsync(user, model.Code, model.Password);
			if (result.Succeeded)
			{
				houseKeepingLogger.LogInformation($"Successfully reset password for user {user.UserName}");
				return Ok();
			}
			houseKeepingLogger.LogError($"Failed to reset password for user {user.UserName}");
			return StatusCode((int)HttpStatusCode.Conflict);
		}

		/// <summary>
		/// Get array of user name and full name.
		/// </summary>
		/// <returns>userName, fullName</returns>
		[HttpGet("AllUsers")]
		public Tuple<string, string>[] GetAllUsers()
		{
			return accountFunctions.GetAllUsers().Select(d => Tuple.Create(d.Item2, d.Item3)).ToArray();
		}

		[HttpGet("UserIdByUser")]
		public Guid GetUserIdByUser([FromQuery] string username)
		{
			return accountFunctions.GetUserIdByUser(username);
		}

		/// <summary>
		/// Admin or scheduler clean up old user tokens
		/// </summary>
		/// <param name="pastDateUtc"></param>
		/// <returns></returns>
		[Authorize(Roles = RoleConstants.Admin)]
		[HttpDelete("RemoveOldUserTokens/{pastDateUtc}")]
		public async Task<int> RemoveOldUserTokens(DateTime pastDateUtc)
		{
			return await accountFunctions.RemoveOldUserTokens(pastDateUtc);
		}

		/// <summary>
		/// User to remove all user refresh tokens
		/// </summary>
		/// <returns></returns>
		[HttpDelete("RemoveUserRefreshTokens")]
		public async Task<int> RemoveUserRefreshTokens()
		{
			ApplicationUser currentUser = await UserManager.FindByNameAsync(User.Identity.Name);
			var currentUserId = currentUser.Id;
			return await accountFunctions.RemoveUserTokens(currentUserId, authSettings.TokenProviderName, "RefreshToken");
		}

		[Authorize(Roles = RoleConstants.Admin)]
		[HttpDelete("AdminRemoveUserRefreshTokens/{username}")]
		public async Task<int> AdminRemoveUserRefreshTokens(string username)
		{
			ApplicationUser currentUser = await UserManager.FindByNameAsync(username);
			var currentUserId = currentUser.Id;
			return await accountFunctions.RemoveUserTokens(currentUserId, authSettings.TokenProviderName, "RefreshToken");
		}

		#region Helpers

		/// <summary>
		/// Add IdentityResult.Errors to ModelState. And ModelState.IsValid will then become false.
		/// </summary>
		/// <param name="result"></param>
		/// <returns>Error messages from IdentityResult.Errors</returns>
		private string LogIdentityResultErrors(IdentityResult result)
		{
			if (result.Errors != null)
			{
				foreach (IdentityError error in result.Errors)
				{
					ModelState.AddModelError(error.Code, error.Description);
				}

				var errorMessage = String.Join(Environment.NewLine, result.Errors.Select(d => $"{d.Code} : {d.Description}"));
				houseKeepingLogger.LogError(errorMessage);
				return errorMessage;
			}

			return null;
		}

		private IActionResult GetErrorResult(IdentityResult result)
		{
			if (result == null)
			{
				return new StatusCodeResult(500);
			}

			if (!result.Succeeded)
			{
				var errorMessage = LogIdentityResultErrors(result);

				if (ModelState.IsValid)
				{
					return BadRequest(errorMessage);
				}

				return BadRequest(ModelState); // Controller will return something like {"PasswordMismatch":["Incorrect password."]}
			}

			return null;
		}

		private class ExternalLoginData
		{
			public string LoginProvider { get; set; }
			public string ProviderKey { get; set; }
			public string UserName { get; set; }

			public IList<Claim> GetClaims()
			{
				IList<Claim> claims = new List<Claim>
				{
					new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider)
				};

				if (UserName != null)
				{
					claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
				}

				return claims;
			}

			public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
			{
				if (identity == null)
				{
					return null;
				}

				Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

				if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
					|| String.IsNullOrEmpty(providerKeyClaim.Value))
				{
					return null;
				}

				if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
				{
					return null;
				}

				return new ExternalLoginData
				{
					LoginProvider = providerKeyClaim.Issuer,
					ProviderKey = providerKeyClaim.Value,
					UserName = identity.Name
				};
			}
		}

		#endregion
	}
}
