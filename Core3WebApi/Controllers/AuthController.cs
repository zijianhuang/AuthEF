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
			this.symmetricSecurityKey= symmetricSecurityKey;
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
		/// Generate new JWT token according to refresh token and connectionId
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

			var tokenHelper = new TokensHelper(UserManager, authSettings.TokenProviderName);
			var tokenTextExisting = await tokenHelper.MatchToken(user, authSettings.TokenProviderName, "RefreshToken", refreshToken, connectionId);
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

			Console.WriteLine($"JWT token expiry: expires: {expires.UtcDateTime}; ValidFrom: {token.ValidFrom}; ValidTo: {token.ValidTo}");

			string accessToken = new JwtSecurityTokenHandler().WriteToken(token);

			const string tokenName = "RefreshToken";
			//await UserManager.RemoveAuthenticationTokenAsync(user, Constants.AppCodeName, tokenName);
			var refreshToken = await UserManager.GenerateUserTokenAsync(user, authSettings.TokenProviderName, tokenName);
			//await UserManager.SetAuthenticationTokenAsync(user, Constants.AppCodeName, tokenName, refreshToken);
			var tokenHelper = new TokensHelper(UserManager, authSettings.TokenProviderName);
			await tokenHelper.UpsertToken(user, authSettings.TokenProviderName, tokenName, refreshToken, connectionId);

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
	/// </summary>
	public class TokensHelper
	{
		/// <summary>
		/// 
		/// </summary>
		/// <param name="userManager"></param>
		/// <param name="tokenProviderName">Your app token provider name, or oAuth2 token provider name.</param>
		public TokensHelper(ApplicationUserManager userManager, string tokenProviderName)
		{
			this.userManager = userManager;
			this.tokenProviderName = tokenProviderName;
		}

		readonly ApplicationUserManager userManager;

		readonly string tokenProviderName;
		/// <summary>
		/// Add or update a token of an existing connection.
		/// </summary>
		/// <param name="user"></param>
		/// <param name="loginProvider"></param>
		/// <param name="tokenName"></param>
		/// <param name="newTokenValue"></param>
		/// <param name="connectionId"></param>
		/// <returns></returns>
		public async Task<IdentityResult> UpsertToken(ApplicationUser user, string loginProvider, string tokenName, string newTokenValue, Guid connectionId)
		{
			string composedTokenName = $"{tokenName}_{connectionId.ToString("N")}";
			string tokensText = await userManager.GetAuthenticationTokenAsync(user, loginProvider, composedTokenName);
			await userManager.RemoveAuthenticationTokenAsync(user, tokenProviderName, composedTokenName); // need to remove it first, otherwise, Set won't work.
			return await userManager.SetAuthenticationTokenAsync(user, tokenProviderName, composedTokenName, newTokenValue);
		}

		/// <summary>
		/// Lookup user tokens and find 
		/// </summary>
		/// <param name="user"></param>
		/// <param name="loginProvider"></param>
		/// <param name="tokenName"></param>
		/// <param name="tokenValue"></param>
		/// <param name="connectionId"></param>
		/// <returns></returns>
		public async Task<bool> MatchToken(ApplicationUser user, string loginProvider, string tokenName, string tokenValue, Guid connectionId)
		{
			string composedTokenName = $"{tokenName}_{connectionId.ToString("N")}";
			string storedToken = await userManager.GetAuthenticationTokenAsync(user, loginProvider, composedTokenName);
			return tokenValue == storedToken;
		}
	}

}
