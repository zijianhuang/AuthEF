using Fonlow.AspNetCore.Identity.Account;
using Fonlow.AspNetCore.Identity.EntityFrameworkCore;
using Fonlow.Auth.Models;
using Fonlow.WebApp.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Fonlow.AspNetCore.Identity.Controllers
{
	/// <summary>
	/// Based on ASP.NET Core Identity, this controller takes care of authentication and authorization, as well as refresh token and oAuth2.
	/// Account management functions are with AccountController, which use the same set of Identity DB tables.
	/// This also supports one user with multiple connections from different devices and browser tabs, governed by server generated uuid/GUID stated in Scope as ConnectionId:ServerGeneratedGuid.
	/// This supports ROPC without registering and checking client_id as described in https://datatracker.ietf.org/doc/html/rfc6749#section-2.2 and PKCE.
	/// For more secure solution free and open sourced, check https://identityserver8.readthedocs.io/en/latest/quickstarts/6_aspnet_identity.html
	/// </summary>
	[ApiExplorerSettings(IgnoreApi = true)]
	[Route("token")]
	//[ApiController]
	public class AuthController : ControllerBase
	{
		readonly ApplicationUserManager userManager;
		readonly IAuthSettings authSettings;
		readonly Microsoft.IdentityModel.Tokens.TokenValidationParameters tokenValidationParameters;
		readonly ILogger<AuthController> logger;
		readonly AccountFunctions accountFunctions;

		/// <summary>
		/// 
		/// </summary>
		/// <param name="userManager"></param>
		/// <param name="options"></param>
		/// <param name="tokenValidationParameters"></param>
		/// <param name="authSettings"></param>
		/// <param name="logger"></param>
		public AuthController(ApplicationUserManager userManager, DbContextOptions<ApplicationDbContext> options,
			[FromKeyedServices("NotValidateLifetime")] Microsoft.IdentityModel.Tokens.TokenValidationParameters tokenValidationParameters,
			IAuthSettings authSettings, ILogger<AuthController> logger)
		{
			this.userManager = userManager;
			this.authSettings = authSettings;
			this.tokenValidationParameters = tokenValidationParameters;
			this.logger = logger;
			accountFunctions = new AccountFunctions(options);
		}

		/// <summary>
		/// A client program call to initialize signin with returned bearer access token and refresh token.
		/// However, keep-live connection is still working after the token expires. 
		/// The user login also return a unique Id for the connection: connectionId, contained in field scope, in the form of connectionId:{connectionId}. 
		/// The client should store this connection ID created by the service, to refresh token later.
		/// </summary>
		/// <param name="model"></param>
		/// <returns>Access token and refresh token, along scope including connectionId.</returns>
		[AllowAnonymous]
		[Consumes("application/x-www-form-urlencoded")] // redundant generally because of FromForm below
		[HttpPost]
		public async Task<ActionResult<AccessTokenResponse>> Authenticate([FromForm] RequestBase model)
		{
			ArgumentNullException.ThrowIfNull("Model required", nameof(model));

			if (model is ROPCRequst)
			{
				ROPCRequst ropcRequest = model as ROPCRequst;
				ApplicationUser user = await userManager.FindByNameAsync(ropcRequest.Username);
				if (user == null)
				{
					return Unauthorized(new { message = "Username or password is invalid" });
				}

				bool passwordIsCorrect = await userManager.CheckPasswordAsync(user, ropcRequest.Password);
				if (!passwordIsCorrect)
				{
					return Unauthorized(new { message = "Username or password is incorrect" });
				}

				var tokenHelper = new UserTokenHelper(userManager, tokenValidationParameters, authSettings, logger);
				return await tokenHelper.GenerateJwtToken(user, ropcRequest.Username, ropcRequest.Scope, true);
			}
			else if (model is RefreshAccessTokenRequest refreshAccessTokenRequest) //Section 1.5 of rfc6749
			{

				Guid connectionId = string.IsNullOrEmpty(refreshAccessTokenRequest.Scope) ? Guid.Empty : UserTokenHelper.ExtractConnectionId(refreshAccessTokenRequest.Scope);
				var userId = await accountFunctions.FindUserIdByUserToken(authSettings.TokenProviderName, "RefreshToken", connectionId, TimeSpan.FromSeconds(authSettings.RefreshTokenExpirySpanSeconds));

				if (userId == null)
				{
					return StatusCode(400, new { message = "Invalid to refresh token. Please sign in again." });
					//refresh token invalid, expired, revoked or malformed according to https://datatracker.ietf.org/doc/html/rfc6749#section-5.2 
				}

				var tokenHelper = new UserTokenHelper(userManager, tokenValidationParameters, authSettings, logger);
				var user = await userManager.FindByIdAsync(userId.Value);
				return await tokenHelper.GenerateJwtToken(user, user.UserName, refreshAccessTokenRequest.Scope, false);
			}

			throw new NotSupportedException("token payload RequestBase not supported.");
		}

	}

}
