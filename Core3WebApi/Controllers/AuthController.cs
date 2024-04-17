﻿using Fonlow.AspNetCore.Identity;
using Fonlow.WebApp.Accounts;
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

namespace WebApp.Controllers
{

	/// <summary>
	/// Based on ASP.NET Core Identity, this controller takes care of authentication and authorization, as well as refresh token and oAuth2.
	/// Account management functions should go to AccountController, which use the same set of Identity DB tables.
	/// This also supports one user with multiple connections from different devices and browser tabs, governed by client generated uuid/GUID.
	/// </summary>
	[ApiExplorerSettings(IgnoreApi = true)]
	[Route("token")]
	public class AuthController : ControllerBase
	{
		public ApplicationUserManager UserManager
		{
			get; private set;
		}

		readonly IAuthSettings authSettings;
		readonly SymmetricSecurityKey symmetricSecurityKey;

		public AuthController(ApplicationUserManager userManager, SymmetricSecurityKey symmetricSecurityKey, IAuthSettings authSettings)
		{
			UserManager = userManager;
			this.authSettings = authSettings;
			this.symmetricSecurityKey = symmetricSecurityKey;
		}

		/// <summary>
		/// A client program calls to initialize login with returned bearer access token and refresh token
		/// Token expiration in 24 hours, however, in DEBUG build, 5 minutes plus default 5 minutes ClockSkew. https://stackoverflow.com/questions/47754556/is-there-a-minimum-expiration-time-for-jwtsecuritytoken 
		/// However, keep-live connection is still working after the token expires. 
		/// The user login also return a unique Id for the connection: connectionId. The client should store this connection ID created by the service, to refresh token later.
		/// </summary>
		/// <param name="model"></param>
		/// <returns>Access token and refresh token, along with other meta data.</returns>
		[AllowAnonymous]
		[Consumes("application/x-www-form-urlencoded")]
		[HttpPost]
		public async Task<ActionResult<TokenResponseModel>> Authenticate([FromForm] UsernameModel model)
		{
			ApplicationUser user = await UserManager.FindByNameAsync(model.Username);
			if (user == null)
			{
				return Unauthorized(new { message = "Username or password is invalid" });
			}

			bool passwordIsCorrect = await UserManager.CheckPasswordAsync(user, model.Password);
			if (!passwordIsCorrect)
			{
				return Unauthorized(new { message = "Username or password is incorrect" });
			}

			var tokenHelper = new UserTokenHelper(UserManager, symmetricSecurityKey, authSettings);
			var newLoginConnectionId = Guid.NewGuid();
			return await tokenHelper.GenerateJwtToken(user, model.Username, newLoginConnectionId);
		}

		/// <summary>
		/// Generate new JWT token according to refresh token and connectionId.
		/// This call supports AllowAnonymous. So after the access token expires, the client may still acquire new one without login again.
		/// However, ask your PO and IT security expert for further advice regarding UX and security.
		/// </summary>
		/// <param name="refreshToken"></param>
		/// <param name="username"></param>
		/// <param name="connectionId"></param>
		/// <returns></returns>
		[AllowAnonymous]
		[HttpGet("tokenByRefreshToken")]
		public async Task<ActionResult<TokenResponseModel>> GetTokenWithRefreshToken([FromHeader] string refreshToken, [FromHeader] string username, [FromHeader] Guid connectionId)
		{
			ApplicationUser user = await UserManager.FindByNameAsync(username);
			if (user == null)
			{
				return BadRequest(new { message = "Username or password is invalid" });
			}

			var tokenHelper = new UserTokenHelper(UserManager, symmetricSecurityKey, authSettings);
			var tokenTextExisting = await tokenHelper.MatchToken(user, "RefreshToken", refreshToken, connectionId);
			if (!tokenTextExisting)
			{
				return StatusCode(401, new { message = "Invalid to retrieve token through refreshToken" }); // message may be omitted in prod build, to avoid exposing implementation details.
			}

			return await tokenHelper.GenerateJwtToken(user, username, connectionId); //the old refresh token is removed
		}

	}

}
