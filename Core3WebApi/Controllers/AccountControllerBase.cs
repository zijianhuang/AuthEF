using Fonlow.AspNetCore.Identity;
using Fonlow.AspNetCore.Identity.Account;
using Fonlow.AspNetCore.Identity.EntityFrameworkCore;
using Fonlow.CodeDom.Web;
using Fonlow.WebApp.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Fonlow.Auth.Controllers
{
	/// <summary>
	/// Manage user accounts stored in ASP.NET Core Identity database.
	/// </summary>
	/// <remarks>Majorty of the codes were originally from ASP.NET MVC scarfolding codes with slight modification for ASP.NET Core Web API. And it is not a universal solution for real worlds scenarios. Please consult with IT security guys.</remarks>
	[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
	[Route("api/[controller]")]
	public abstract class AccountControllerBase : ControllerBase
	{
		readonly DbContextOptions<ApplicationDbContext> options;
		readonly AccountFunctions accountFunctions;
		protected readonly ILogger apiLogger;

		protected readonly ApplicationUserManager userManager;
		readonly IAuthSettings authSettings;
		readonly TokenValidationParameters tokenValidationParameters;

		public AccountControllerBase(ApplicationUserManager userManager, DbContextOptions<ApplicationDbContext> options, IAuthSettings authSettings, [FromKeyedServices("NotValidateLifetime")] TokenValidationParameters tokenValidationParameters,
		ILogger apiLogger)
		{
			this.userManager = userManager;
			this.authSettings = authSettings;
			this.apiLogger = apiLogger;
			this.options = options;
			this.tokenValidationParameters = tokenValidationParameters;
			accountFunctions = new AccountFunctions(options);
		}

		/// <summary>
		/// Sign out.
		/// Even though the access token may be expired and the connectionId is invalid, the signout process still return 204.
		/// </summary>
		/// <param name="connectionId"></param>
		/// <returns>200 for perfect logout. 202 Accepted for unauthorized logout however without doing anything, not to reveal user details.</returns>
		/// <remarks>This will also remove the refresh token.</remarks>
		[AllowAnonymous]
		[HttpPost("Logout/{connectionId}")]
		public async Task<IActionResult> Logout(Guid connectionId)
		{
			if (AuthenticationHeaderValue.TryParse(Request.Headers.Authorization, out var headerValue))
			{
				var scehma = headerValue.Scheme;
				Debug.Assert("bearer".Equals(scehma, StringComparison.OrdinalIgnoreCase));
				var accessToken = headerValue.Parameter;
				var tokenHelper = new UserTokenHelper(userManager, tokenValidationParameters, authSettings, apiLogger);
				var user = await tokenHelper.ValidateAccessToken(accessToken); // even if the accessToken expires
				if (user == null)
				{
					apiLogger.LogWarning("User not found with access token");
					return StatusCode((int)HttpStatusCode.Accepted);
				}

				// https://learn.microsoft.com/en-us/aspnet/core/migration/1x-to-2x/identity-2x#use-httpcontext-authentication-extensions
				await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

				try
				{
					await accountFunctions.RemoveUserToken(user.Id, authSettings.TokenProviderName, "RefreshToken", connectionId); //Up to admin to clear records if the user did not sign out.
				}
				catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException ex)
				{
					apiLogger.LogWarning(ex.Message);
				}
				// No need to care about true or false.
				return StatusCode((int)HttpStatusCode.OK);
			}
			else
			{
				apiLogger.LogWarning("Someone want to logout witnout access token");
				return StatusCode((int)HttpStatusCode.Accepted);
			}
		}

		/// <summary>
		/// Get user info of current logged user
		/// </summary>
		/// <returns></returns>
		[HttpGet("UserInfo")]
		public virtual async Task<UserInfoViewModel> GetUserInfo()
		{
			ApplicationUser applicationUser = await userManager.FindByNameAsync(User.Identity.Name);// .GetUserAsync(User) not working
			IList<string> roleNames = await userManager.GetRolesAsync(applicationUser);
			Guid userId = applicationUser.Id;
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
		public virtual Guid GetUserIdByFullName([FromQuery] string cn)
		{
			return accountFunctions.GetUserIdByFullName(cn);
		}


		[HttpGet("idByEmail")]
		public virtual Guid GetUserIdByEmail([FromQuery] string email)
		{
			return accountFunctions.GetUserIdByEmail(email);
		}

		/// <summary>
		/// Mapping between full user name and user Id
		/// </summary>
		/// <returns>Key is full name, and value is user Id.</returns>
		[HttpGet("UserIdMapByFullName")]
		public virtual KeyValuePair<string, Guid>[] GetUserIdMapByFullName()
		{
			return accountFunctions.GetUserIdMapByFullName();
		}

		/// <summary>
		/// Mapping between email address and user Id
		/// </summary>
		/// <returns>Key is email address, and value is user Id.</returns>
		[HttpGet("UserIdMapByEmail")]
		public virtual KeyValuePair<string, Guid>[] GetUserIdMapByEmail()
		{
			return accountFunctions.GetUserIdMapByEmail();
		}

		/// <summary>
		/// Get user info of a user ID.
		/// </summary>
		/// <param name="userId"></param>
		/// <returns></returns>
		UserInfoViewModel GetUserInfoViewModel(Guid userId)
		{
			ApplicationUser user = userManager.FindByIdAsync(userId).Result;
			string[] roleNames = userManager.GetRolesAsync(user).Result.ToArray();

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

		/// <summary>
		/// Derived class should restrict access through decorating with admin
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		[HttpGet("Users/{id}")]
		public virtual UserInfoViewModel GetUserInfoById(Guid id)
		{
			return GetUserInfoViewModel(id);
		}

		// POST api/Account/ChangePassword
		[HttpPut("ChangePassword")]
		public virtual async Task<IActionResult> ChangePassword([FromBody] ChangePasswordBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ApplicationUser applicationUser = await userManager.FindByNameAsync(User.Identity.Name);

			IdentityResult result = await userManager.ChangePasswordAsync(applicationUser, model.OldPassword,
				model.NewPassword);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return StatusCode((int)HttpStatusCode.NoContent);
		}

		// POST api/Account/SetPassword
		[HttpPut("SetPassword")]
		public virtual async Task<IActionResult> SetPassword([FromBody] SetPasswordBindingModel model)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			ApplicationUser applicationUser = await userManager.FindByNameAsync(User.Identity.Name);
			IdentityResult result = await userManager.AddPasswordAsync(applicationUser, model.NewPassword);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return StatusCode((int)HttpStatusCode.NoContent);
		}

		/// <summary>
		/// : AdminOrManager
		/// </summary>
		/// <param name="model"></param>
		/// <returns></returns>
		/// <exception cref="ArgumentException"></exception>
		[HttpPut("SetUserPassword")]
		public virtual async Task<IActionResult> SetUserPassword([FromBody] SetUserPasswordBindingModel model)
		{
			if (model.NewPassword != model.ConfirmPassword)
				throw new ArgumentException("Passwords mismached.");

			ApplicationUser applicationUser = await userManager.FindByIdAsync(model.UserId);

			IdentityResult pwdValidateResult = await userManager.PasswordValidators.First().ValidateAsync(userManager, applicationUser, model.NewPassword);
			if (!pwdValidateResult.Succeeded)
			{
				return GetErrorResult(pwdValidateResult);
			}

			if (applicationUser == null)
			{
				return NotFound();
			}
			applicationUser.PasswordHash = userManager.PasswordHasher.HashPassword(applicationUser, model.NewPassword);
			IdentityResult result = await userManager.UpdateAsync(applicationUser);

			if (!result.Succeeded)
			{
				return GetErrorResult(result);
			}

			return StatusCode((int)HttpStatusCode.NoContent);
		}

		/// <summary>
		/// Remove user and also remove from the entities table.
		/// </summary>
		/// <param name="userId"></param>
		/// <returns></returns>
		[HttpDelete("RemoveUser")]
		public virtual async Task<IActionResult> RemoveUser([FromQuery] Guid userId)
		{
			ApplicationUser currentUser = await userManager.FindByNameAsync(User.Identity.Name);
			if (userId == currentUser.Id)
			{
				Debug.WriteLine("Attempted to delete self.");
				ModelState.AddModelError("NotAllowedDeleteSelf", "Not allowed to delete self.");
				return BadRequest(ModelState);
			}

			try
			{
				ApplicationUser user = await userManager.FindByIdAsync(userId);
				if (user == null)
				{
					//transaction.Rollback();
					apiLogger.LogWarning("User {0} not found, so it can't be deleted.", userId);
					return StatusCode((int)HttpStatusCode.NoContent);
				}

				const string adminRoleName = "admin";
				IList<string> roleNames = await userManager.GetRolesAsync(user);
				bool isAdmin = roleNames.Contains(adminRoleName);
				if (isAdmin)
				{
					if (accountFunctions.GetUserCountOfRole(adminRoleName) == 1)
					{
						ModelState.AddModelError("LastAdmin", "Last admin account.");
						return BadRequest(ModelState);
					}
				}

				// await userManager.RemoveFromRolesAsync(user, roleNames.ToArray());// no need anymore. MS has fixed the bug.

				// await userManager.RemoveAuthenticationTokenAsync(user, authSettings.TokenProviderName, "RefreshToken"); one is not enough
				var c = await RemoveUserTokens(user);
				apiLogger.LogInformation($"User {User.Identity.Name} removed from userTokens, total: {c}.");
				IdentityResult result = await userManager.DeleteAsync(user);
				if (!result.Succeeded)
				{
					return GetErrorResult(result);
				}

				apiLogger.LogInformation($"User {User.Identity.Name} removed from identity DB.");
				//todo: add some codes to remove from internal CRM

				return StatusCode((int)HttpStatusCode.NoContent);


			}
			catch (Exception ex)
			{
				apiLogger.LogError("Cannot delete user: " + ex.ToString());
				throw;
			}

		}

		[HttpPost("Search")]
		public virtual UserItemEx[] Search([FromBody] UserSearchModel c)
		{
			return accountFunctions.SearchUsers(c);
		}

		/// <summary>
		/// Update user
		/// </summary>
		/// <param name="model"></param>
		/// <returns></returns>
		[HttpPut("Update")]
		public virtual async Task<IActionResult> Update([FromBody] UserUpdate model)
		{
			if (!ModelState.IsValid)
			{
				return new BadRequestObjectResult("ModelState");
			}

			try
			{
				ApplicationUser user = await userManager.FindByIdAsync(model.Id);
				if (user == null)
				{
					apiLogger.LogWarning("User {0} not found, so it can't be updated.", model.Id);
					return StatusCode((int)HttpStatusCode.NoContent); //intended
				}

				user.FullName = model.FullName;
				user.Email = model.Email;
				UpperInvariantLookupNormalizer normalizer = new UpperInvariantLookupNormalizer();
				user.NormalizedEmail = normalizer.NormalizeEmail(model.Email);
				var result = await userManager.UpdateAsync(user);
				if (result.Succeeded)
				{
					return StatusCode((int)HttpStatusCode.NoContent);
				}
				else
				{
					return new BadRequestObjectResult(result.Errors);
				}
			}
			catch (Exception ex)
			{
				apiLogger.LogError("Cannot update user: " + ex.ToString());
				throw;
			}
		}

		/// <summary>
		/// Create user, but without role
		/// </summary>
		/// <param name="model"></param>
		/// <returns>Id of user. If error, the response could be ModelError[] or IdentityError[].</returns>
		[HttpPost("Users")]
		public virtual async Task<ActionResult<Guid>> Register([FromBody] RegisterBindingModel model)
		{
			var r = await RegisterBasic(model);
			if (r.Item1 != null) // error
			{
				return r.Item1;
			}

			var resultOfPostHandling = await PostRegister(model);
			if (resultOfPostHandling == null)
			{
				return CreatedAtAction(nameof(GetUserInfoById), new { id = r.Item2 }, // route value
				r.Item2 // returned body
				); //RESTful
			}
			else
			{
				return resultOfPostHandling;
			}
		}

		protected async Task<Tuple<ObjectResult, Guid>> RegisterBasic(RegisterBindingModel model)
		{
			Debug.WriteLine($"Register user: {model.UserName}, fullName: {model.FullName}, email: {model.Email}");
			if (!ModelState.IsValid)//Though not explicitly verify in codes, ConfirmPassword is verified apparently by the runtime.
			{
				apiLogger.LogWarning("Bad request. Why?");
				return Tuple.Create<ObjectResult, Guid>(new BadRequestObjectResult(ModelState.Values.FirstOrDefault()?.Errors), Guid.Empty);
			}

			ApplicationUser existing = await userManager.FindByEmailAsync(model.Email);
			if (existing != null)
			{
				return Tuple.Create<ObjectResult, Guid>(new BadRequestObjectResult(new IdentityError[]{new IdentityError{
					Code= "FailedCreate",
					Description="If an account exists for this email, you’ll receive further instructions."
				} }), Guid.Empty);
			}

			ApplicationUser user = new ApplicationUser() { UserName = model.UserName, Email = model.Email, FullName = model.FullName };
			IdentityResult result;

			result = await userManager.CreateAsync(user, model.Password);

			if (!result.Succeeded)
			{
				string errors = String.Join(Environment.NewLine, result.Errors.Select(d => d.Description));
				apiLogger.LogError(errors);
				return Tuple.Create<ObjectResult, Guid>(new BadRequestObjectResult(result.Errors), Guid.Empty);
			}

			return Tuple.Create<ObjectResult, Guid>(null, user.Id);
		}


		/// <summary>
		/// Derived function should return null after successful post handling of register, or one of the derived class objects of ObjectResult like UnprocessableEntityObjectResult
		/// </summary>
		/// <param name="model"></param>
		/// <returns>Null if no drama, otherwise, an error result to return the client</returns>
		protected virtual async Task<ActionResult> PostRegister(RegisterBindingModel model)
		{
			return null;
		}

		/// <summary>
		/// Role names in uppercase
		/// </summary>
		/// <param name="userId"></param>
		/// <param name="roleName"></param>
		/// <returns></returns>
		[HttpPost("AddRole")]
		public virtual async Task<IActionResult> AddRole([FromQuery] Guid userId, [RequiredFromQuery] string roleName)
		{
			var adminRoleName = GetAdminRoleName();
			bool toAddAdmin = roleName.Equals(adminRoleName, StringComparison.CurrentCultureIgnoreCase);
			bool currentUserIsNotAdmin = !User.IsInRole(adminRoleName);
			if (toAddAdmin && currentUserIsNotAdmin)
			{
				return new BadRequestObjectResult("OnlyAdmin");
			}

			var roleNames = accountFunctions.GetAllRoleNames(); //upper case already.
			bool roleNameIsValid = roleNames.Any(d => d == roleName.ToUpper());
			if (!roleNameIsValid)
			{
				return new BadRequestObjectResult("BadRole");
			}

			ApplicationUser user = await userManager.FindByIdAsync(userId);
			IdentityResult result = await userManager.AddToRoleAsync(user, roleName);
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

		protected abstract string GetAdminRoleName();


		[HttpDelete("RemoveRole")]
		public virtual async Task<IActionResult> RemoveRole([FromQuery] Guid userId, [RequiredFromQuery] string roleName)
		{
			var adminRoleName = GetAdminRoleName();
			if (roleName.Equals(adminRoleName, StringComparison.CurrentCultureIgnoreCase)
				&& (!User.IsInRole(adminRoleName)))
			{
				apiLogger.LogWarning("Only admin could remove role.");
				return new BadRequestResult();
				//throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.BadRequest) { ReasonPhrase = "OnlyAdmin" });
			}


			ApplicationUser user = await userManager.FindByIdAsync(userId);

			IdentityResult result = await userManager.RemoveFromRoleAsync(user, roleName);
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
		public virtual string[] GetAllRoleNames()
		{
			return accountFunctions.GetAllRoleNames();
		}

		/// <summary>
		/// Admin or scheduler clean up old user tokens
		/// </summary>
		/// <param name="pastDateUtc"></param>
		/// <returns></returns>
		[HttpDelete("RemoveOldUserTokens/{pastDateUtc}")]
		public virtual async Task<int> RemoveOldUserTokens(DateTime pastDateUtc)
		{
			return await accountFunctions.RemoveOldUserTokens(pastDateUtc);
		}

		/// <summary>
		/// User to remove all refresh tokens of user
		/// </summary>
		/// <returns></returns>
		[HttpDelete("RemoveRefreshTokensOfUser")]
		public virtual async Task<int> RemoveRefreshTokensOfUser()
		{
			ApplicationUser currentUser = await userManager.FindByNameAsync(User.Identity.Name);
			var currentUserId = currentUser.Id;
			return await accountFunctions.RemoveTokensOfUser(currentUserId, authSettings.TokenProviderName, "RefreshToken");
		}

		[HttpDelete("AdminRemoveUserRefreshTokens/{username}")]
		public virtual async Task<int> AdminRemoverRefreshTokensOfUsers(string username)
		{
			ApplicationUser currentUser = await userManager.FindByNameAsync(username);
			var currentUserId = currentUser.Id;
			return await accountFunctions.RemoveTokensOfUser(currentUserId, authSettings.TokenProviderName, "RefreshToken");
		}

		/// <summary>
		/// Basic ForgotPassword features:
		/// 1. If user not found, return NoContent
		/// 2. Otherwise, send the reset token via Email or other means.
		/// 
		/// Real world applications may have different rules.
		/// </summary>
		/// <returns></returns>
		/// <remarks>For simple application, probably no need to support reseting password because of dependency on SMTP or other authentication authority.</remarks>
		protected virtual async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
		{

			if (ModelState.IsValid)
			{
				ApplicationUser user;
				try
				{
					user = await userManager.FindByEmailAsync(model.EmailAddress);
				}
				catch (InvalidOperationException ex)
				{
					apiLogger.LogError(ex.ToString());
					return BadRequest("Email address is assoicated with multiple accounts. Please contact system admin to resolve.");
				}

				if (user == null)
				{
					// Don't reveal that the user does not exist or is not confirmed
					return StatusCode((int)HttpStatusCode.NoContent);
				}

				// Send an email with this link
				string code = await userManager.GeneratePasswordResetTokenAsync(user); //expiry 24 hours by default
				Debug.WriteLine("Reset code is : " + code);
				//var uiHost = Request.Headers["origin"];
				//var acceptLanguage = Request.Headers["accept-language"];
				//var requestHostUri = new Uri(uiHost);
				string resetQuery = $"?code={Uri.EscapeDataString(code)}";

				Uri resetUri = new Uri(new Uri(model.ResetLinkPath), resetQuery);
				string callbackUrl = resetUri.ToString();
				Debug.WriteLine("Reset uri is: " + callbackUrl);

				var emailResult = await DeliverResetLink(user, callbackUrl);
				return emailResult;

			}

			// If we got this far, something failed, not to tell if the operation is successful.
			return StatusCode((int)HttpStatusCode.NoContent);
		}

		protected virtual Task<IActionResult> DeliverResetLink(ApplicationUser user, string callbackUrl)
		{
			throw new NotImplementedException("Derived class of AccountControllerBase should implement this.");
		}

		/// <summary>
		/// Called by the callbackUrl from the ForgotPassword function, when user clicks the link.
		/// </summary>
		/// <param name="model"></param>
		/// <returns></returns>
		[AllowAnonymous]
		[HttpPost("ResetPassword")]
		public virtual async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel model)
		{
			ApplicationUser user = await userManager.FindByEmailAsync(model.Email);
			if (user == null)
			{
				// Don't reveal that the user does not exist
				return Ok();
			}

			Debug.WriteLine($"userId: {user.Id} password: {model.Password} code: {model.Code}");
			IdentityResult result = await userManager.ResetPasswordAsync(user, model.Code, model.Password);
			if (result.Succeeded)
			{
				apiLogger.LogInformation($"Successfully reset password for user {user.UserName}");
				return Ok();
			}

			apiLogger.LogError($"Failed to reset password for user {user.UserName}");
			return new BadRequestObjectResult(result.Errors);
		}


		[HttpGet("UserIdByUser")]
		public virtual Guid GetUserIdByUser([FromQuery] string username)
		{
			return accountFunctions.GetUserIdByUser(username);
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="userId"></param>
		/// <returns></returns>
		/// <remarks>System.InvalidOperationException: UserId not found. But this function will just return empty array.</remarks>
		[HttpGet("Roles")]
		public async Task<string[]> GetRoles([FromQuery] Guid userId)
		{
			try
			{
				ApplicationUser user = await userManager.FindByIdAsync(userId);
				if (user == null)
				{
					throw new ArgumentException("userId does not indicate an existing user.");
				}

				IList<string> r = await userManager.GetRolesAsync(user);
				return r.ToArray();

			}
			catch (InvalidOperationException ex)
			{
				apiLogger.LogWarning(ex.Message);
				return Array.Empty<string>();
			}
		}

		/// <summary>
		/// Of all users
		/// </summary>
		/// <returns></returns>
		[HttpGet("UserIdFullNameDic")]
		public virtual IDictionary<Guid, string> GetUserIdFullNameDic()
		{
			return accountFunctions.GetUserIdFullNameDic();
		}

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
				apiLogger.LogError(errorMessage);
				return errorMessage;
			}

			return null;
		}

		async Task<int> RemoveUserTokens(ApplicationUser user)
		{
			using ApplicationDbContext context = new(options);
			return await context.UserTokens.Where(d => d.UserId == user.Id).ExecuteDeleteAsync();
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
	}
}
