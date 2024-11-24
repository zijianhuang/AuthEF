using Fonlow.AspNetCore.Identity;
using Fonlow.Auth.Models;
using Fonlow.WebApp.Accounts;
using Fonlow.WebApp.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebApp.Utilities
{
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
		/// <param name="authSettings">Your app token provider name, or oAuth2 token provider name.</param>
		public UserTokenHelper(ApplicationUserManager userManager, SymmetricSecurityKey symmetricSecurityKey, IAuthSettings authSettings)
		{
			this.userManager = userManager;
			this.authSettings = authSettings;
			this.symmetricSecurityKey= symmetricSecurityKey;
		}

		readonly ApplicationUserManager userManager;
		readonly IAuthSettings authSettings;
		readonly SymmetricSecurityKey symmetricSecurityKey;

		/// <summary>
		/// Add or update a token of an existing connection.
		/// </summary>
		/// <returns></returns>
		public async Task<IdentityResult> UpsertToken(ApplicationUser user, string tokenName, string newTokenValue, Guid connectionId)
		{
			string composedTokenName = $"{tokenName}_{connectionId.ToString("N")}";
			await userManager.RemoveAuthenticationTokenAsync(user, authSettings.TokenProviderName, composedTokenName); // need to remove it first, otherwise, Set won't work. Apparently by design the record is immutable.
			return await userManager.SetAuthenticationTokenAsync(user, authSettings.TokenProviderName, composedTokenName, newTokenValue);
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
			//var isValid = await userManager.VerifyUserTokenAsync(user, authSettings.TokenProviderName, "RefreshToken", tokenValue); probably no need to call this to avoid mix token purpose usages?
			//and can not handle the expiry of refresh token, or any token needs to be expired. Also, cross machines issues as documented on https://stackoverflow.com/questions/51966010/identity-framework-generateusertoken-validation-issue

			string composedTokenName = $"{purpose}_{connectionId.ToString("N")}";
			string storedToken = await userManager.GetAuthenticationTokenAsync(user, authSettings.TokenProviderName, composedTokenName);
			return tokenValue == storedToken;
		}

		/// <summary>
		/// Generate token and refreshToken.
		/// The claim is based on the roles of the user.
		/// The refresh token is stored in the UserTokens table (aspnetusertokens) as JSON text data, for supporting multiple connections of the same user.
		/// </summary>
		/// <param name="user"></param>
		/// <param name="username"></param>
		/// <param name="scope"></param>
		/// <returns></returns>
		public async Task<ActionResult<AccessTokenResponse>> GenerateJwtToken(ApplicationUser user, string username, string scope)
		{
			IList<string> roles = await userManager.GetRolesAsync(user);
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
			var refreshToken = await userManager.GenerateUserTokenAsync(user, authSettings.TokenProviderName, tokenPurpose);
			Guid connectionId = UserTokenHelper.ExtractConnectionId(scope);
			await UpsertToken(user, tokenPurpose, refreshToken, connectionId);

			return new AccessTokenResponse()
			{
				access_token = accessToken,
				token_type = "Bearer",
				//Username = username,
				expires_in = Convert.ToInt32(span.TotalSeconds),
				//Expires = expires.UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ssZ"),
				refresh_token = refreshToken,
				Scope=scope
			};
			//The token contains roles info as shown at https://jwt.io/

		}

		public static Guid ExtractConnectionId(string scope)
		{
			Guid connectionId = Guid.Empty;
			if (!string.IsNullOrEmpty(scope))
			{
				var splits = scope.Split(" ");
				var found = splits.FirstOrDefault(d => d.StartsWith("connectionId:"));
				if (found != null)
				{
					connectionId = Guid.Parse(found.Substring(13));
				}
			}

			return connectionId;
		}

	}

}
