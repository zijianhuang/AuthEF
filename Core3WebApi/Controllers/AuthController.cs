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

namespace PoemsApp.Controllers
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

			//todo: In the future, I can use https://github.com/mycsharp/HttpUserAgentParser to get browser and OS, and let the other service do statistics.
			var connectionId = Guid.NewGuid();
			return await GenerateJwtToken(user, model.Username, connectionId);
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

			var tokenHelper = new UserTokenHelper(UserManager, authSettings.TokenProviderName);
			var tokenTextExisting = await tokenHelper.MatchToken(user, "RefreshToken", refreshToken, connectionId);
			if (!tokenTextExisting)
			{
				return StatusCode(401, new { message = "Invalid to retrieve token through refreshToken" }); // message may be omitted in prod build, to avoid exposing implementation details.
			}

			return await GenerateJwtToken(user, username, connectionId); //the old refresh token is removed
		}

		/// <summary>
		/// Generate token and refreshToken.
		/// The claim is based on the roles of the user.
		/// The refresh token is stored in the UserTokens table (aspnetusertokens) as JSON text data, for supporting multiple connections of the same user.
		/// </summary>
		/// <param name="user"></param>
		/// <param name="username"></param>
		/// <param name="connectionId">connection of existing user login from a device.</param>
		/// <returns></returns>
		async Task<ActionResult<TokenResponseModel>> GenerateJwtToken(ApplicationUser user, string username, Guid connectionId)
		{
			IList<string> roles = await UserManager.GetRolesAsync(user);
			List<Claim> claims = roles.Select(d => new Claim(ClaimTypes.Role, d)).ToList();
			claims.Add(new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName));
			TimeSpan span = TimeSpan.FromSeconds(authSettings.AuthTokenExpirySpanSeconds);
			DateTimeOffset expires = DateTimeOffset.UtcNow.Add(span);
			JwtSecurityToken token = new JwtSecurityToken(
				issuer: authSettings.Issuer,
				audience: authSettings.Audience,
				expires: expires.UtcDateTime,
				claims: claims,
				signingCredentials: new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256)
			);

			string accessToken = new JwtSecurityTokenHandler().WriteToken(token);

			const string tokenPurpose = "RefreshToken";
			var refreshToken = await UserManager.GenerateUserTokenAsync(user, authSettings.TokenProviderName, tokenPurpose);
			var tokenHelper = new UserTokenHelper(UserManager, authSettings.TokenProviderName);
			await tokenHelper.UpsertToken(user, tokenPurpose, refreshToken, connectionId);

			return new TokenResponseModel()
			{
				AccessToken = accessToken,
				TokenType = "Bearer",
				Username = username,
				ExpiresIn = Convert.ToInt32(span.TotalSeconds),
				Expires = expires.UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ssZ"),
				RefreshToken = refreshToken,
				ConnectionId = connectionId,
			};
			//The token contains roles info as shown at https://jwt.io/

		}
	}

	/// <summary>
	/// Handler user tokens for various purposes, like refresh token of JWT and oAuth2.
	/// The user tokens table (aspnetusertokens) has primary key: UserId+LoginProvider+Name.
	/// All functions are based on the built-in functions of ApplicationUserManager.
	/// Fonlow.WebApp.Accounts.IdentityHelper provides fine-grained DB operations based on ApplicationDbContext.
	/// </summary>
	/// <remarks>There are token usages that should not be limited by the same connection Id. In those cases, don't use this help class.</remarks>
	public class UserTokenHelper
	{
		/// <summary>
		/// 
		/// </summary>
		/// <param name="userManager"></param>
		/// <param name="tokenProviderName">Your app token provider name, or oAuth2 token provider name.</param>
		public UserTokenHelper(ApplicationUserManager userManager, string tokenProviderName)
		{
			this.userManager = userManager;
			this.tokenProviderName = tokenProviderName;
		}

		readonly ApplicationUserManager userManager;

		readonly string tokenProviderName;
		/// <summary>
		/// Add or update a token of an existing connection.
		/// </summary>
		/// <returns></returns>
		public async Task<IdentityResult> UpsertToken(ApplicationUser user, string tokenName, string newTokenValue, Guid connectionId)
		{
			string composedTokenName = $"{tokenName}_{connectionId.ToString("N")}";
			await userManager.RemoveAuthenticationTokenAsync(user, tokenProviderName, composedTokenName); // need to remove it first, otherwise, Set won't work. Apparently by design the record is immutable.
			return await userManager.SetAuthenticationTokenAsync(user, tokenProviderName, composedTokenName, newTokenValue);
		}

		/// <summary>
		/// Lookup user tokens and find. There's no explicit checking of expiry date here, 
		/// however, your system should have house keeping functions to regularly clean up expired refresh token, and revoke anytime for any user, selected users and all users.
		/// </summary>
		/// <param name="user"></param>
		/// <param name="purpose"></param>
		/// <param name="tokenValue"></param>
		/// <param name="connectionId"></param>
		/// <returns></returns>
		public async Task<bool> MatchToken(ApplicationUser user, string purpose, string tokenValue, Guid connectionId)
		{
			//var isValid = await userManager.VerifyUserTokenAsync(user, tokenProviderName, "RefreshToken", tokenValue); probably no need to call this to avoid mix token purpose usages?
			string composedTokenName = $"{purpose}_{connectionId.ToString("N")}";
			string storedToken = await userManager.GetAuthenticationTokenAsync(user, tokenProviderName, composedTokenName);
			return tokenValue == storedToken;
		}

	}

}
