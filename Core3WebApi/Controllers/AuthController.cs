using Fonlow.AspNetCore.Identity;
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
using Fonlow.Auth.Models;
using System.Net.Http.Headers;
namespace WebApp.Controllers
{

	/// <summary>
	/// Based on ASP.NET Core Identity, this controller takes care of authentication and authorization, as well as refresh token and oAuth2.
	/// Account management functions should go to AccountController, which use the same set of Identity DB tables.
	/// This also supports one user with multiple connections from different devices and browser tabs, governed by client generated uuid/GUID.
	/// </summary>
	[ApiExplorerSettings(IgnoreApi = true)]
	[Route("token")]
	//[ApiController]
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
		[Consumes("application/x-www-form-urlencoded")] // redundant generally because of FromForm below
		[HttpPost]
		public async Task<ActionResult<AccessTokenResponse>> Authenticate([FromForm] RequestBase model)
		{
			if (model is ROPCRequst)
			{
				ROPCRequst ropcRequest = model as ROPCRequst;
				ApplicationUser user = await UserManager.FindByNameAsync(ropcRequest.Username);
				if (user == null)
				{
					return Unauthorized(new { message = "Username or password is invalid" });
				}

				bool passwordIsCorrect = await UserManager.CheckPasswordAsync(user, ropcRequest.Password);
				if (!passwordIsCorrect)
				{
					return Unauthorized(new { message = "Username or password is incorrect" });
				}

				Guid connectionId = UserTokenHelper.ExtractConnectionId(ropcRequest.Scope);
				var tokenHelper = new UserTokenHelper(UserManager, symmetricSecurityKey, authSettings);
				return await tokenHelper.GenerateJwtToken(user, ropcRequest.Username, ropcRequest.Scope); //todo: some apps may need to deal with scope
			}
			else if (model is RefreshAccessTokenRequest refreshAccessTokenRequest)
			{
				if (AuthenticationHeaderValue.TryParse(Request.Headers.Authorization, out var headerValue)){
					var scehma = headerValue.Scheme;
					Debug.Assert("bearer".Equals(scehma, StringComparison.OrdinalIgnoreCase));
					var accessToken = headerValue.Parameter;
					var jwtSecurityToken = new JwtSecurityTokenHandler().ReadJwtToken(accessToken);
					var uniqueNameClaim = jwtSecurityToken.Claims.Single(d => d.Type == "unique_name");
					var username = uniqueNameClaim.Value;
					var user = await UserManager.FindByNameAsync(username);

					if (user == null)
					{
						return BadRequest(new { message = "Username or password is invalid" });
					}

					Guid connectionId = UserTokenHelper.ExtractConnectionId(refreshAccessTokenRequest.Scope);
					var tokenHelper = new UserTokenHelper(UserManager, symmetricSecurityKey, authSettings);
					var tokenTextExisting = await tokenHelper.MatchToken(user, "RefreshToken", refreshAccessTokenRequest.refresh_token, connectionId);
					if (!tokenTextExisting)
					{
						return StatusCode(401, new { message = "Invalid to retrieve token through refreshToken" }); // message may be omitted in prod build, to avoid exposing implementation details.
					}

					return await tokenHelper.GenerateJwtToken(user, username, refreshAccessTokenRequest.Scope);
				}

				return Unauthorized();
			}

			throw new NotSupportedException("token payload RequestBase not supported.");
		}

	}

}
