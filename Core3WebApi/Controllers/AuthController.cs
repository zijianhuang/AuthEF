using Fonlow.AspNetCore.Identity;
using Fonlow.WebApp.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using WebApp.Utilities;
using Fonlow.Auth.Models;
using System.Net.Http.Headers;
using DemoWebApi.DemoData;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Fonlow.AspNetCore.Identity.Account;
using Fonlow.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Fonlow.AspNetCore.Identity.Controllers
{

	/// <summary>
	/// Based on ASP.NET Core Identity, this controller takes care of authentication and authorization, as well as refresh token and oAuth2.
	/// Account management functions are with AccountController, which use the same set of Identity DB tables.
	/// This also supports one user with multiple connections from different devices and browser tabs, governed by server generated uuid/GUID stated in Scope as ConnectionId:ServerGeneratedGuid
	/// </summary>
	[ApiExplorerSettings(IgnoreApi = true)]
	[Route("token")]
	//[ApiController]
	public class AuthController : ControllerBase
	{
		readonly ApplicationUserManager userManager;
		readonly IAuthSettings authSettings;
		readonly Microsoft.IdentityModel.Tokens.TokenValidationParameters tokenValidationParameters;
		readonly ILogger<WebApiTrace> logger;
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
			IAuthSettings authSettings, ILogger<WebApiTrace> logger)
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
				if (AuthenticationHeaderValue.TryParse(Request.Headers.Authorization, out var headerValue))
				{
					var scehma = headerValue.Scheme;
					Debug.Assert("bearer".Equals(scehma, StringComparison.OrdinalIgnoreCase));
					var accessToken = headerValue.Parameter;
					var tokenHelper = new UserTokenHelper(userManager, tokenValidationParameters, authSettings, logger);
					var user = await tokenHelper.ValidateAccessToken(accessToken); // even if the accessToken expires

					if (user == null)
					{
						return Unauthorized();
					}

					Guid connectionId = string.IsNullOrEmpty(refreshAccessTokenRequest.Scope) ? Guid.Empty : UserTokenHelper.ExtractConnectionId(refreshAccessTokenRequest.Scope);
					var tokenTextExisting = await accountFunctions.MatchTokenWithExpiry(user, authSettings.TokenProviderName, "RefreshToken", refreshAccessTokenRequest.refresh_token, connectionId, TimeSpan.FromSeconds(authSettings.RefreshTokenExpirySpanSeconds));

					if (!tokenTextExisting)
					{
						return StatusCode(401, new { message = "Invalid to refresh token. Please sign in again." });
					}

					return await tokenHelper.GenerateJwtToken(user, user.UserName, refreshAccessTokenRequest.Scope, false);
				}

				return Unauthorized();
			}

			throw new NotSupportedException("token payload RequestBase not supported.");
		}

	}

}
