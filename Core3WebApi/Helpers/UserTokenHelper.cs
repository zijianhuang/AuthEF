using Fonlow.AspNetCore.Identity;
using Fonlow.Auth.Models;
using Fonlow.WebApp.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NuGet.Protocol.Plugins;

namespace WebApp.Utilities
{
	/// <summary>
	/// Handler user tokens for various purposes, like refresh token of JWT and oAuth2.
	/// The user tokens table (aspnetusertokens) has primary key: UserId+LoginProvider+Name.
	/// All functions are based on the built-in functions of ApplicationUserManager -- UserManager<ApplicationUser>.
	/// </summary>
	/// <remarks>There are token usages that should not be limited by the same connection Id. In those cases, don't use this help class.</remarks>
	public class UserTokenHelper
	{
		/// <summary>
		/// 
		/// </summary>
		/// <param name="userManager"></param>
		/// <param name="authSettings">Your app token provider name, or oAuth2 token provider name.</param>
		public UserTokenHelper(ApplicationUserManager userManager, TokenValidationParameters tokenValidationParameters, IAuthSettings authSettings, ILogger logger)
		{
			this.userManager = userManager;
			this.authSettings = authSettings;
			this.tokenValidationParameters = tokenValidationParameters;
		}

		readonly ApplicationUserManager userManager;
		readonly IAuthSettings authSettings;
		readonly TokenValidationParameters tokenValidationParameters;
		readonly ILogger logger;

		/// <summary>
		/// Add or update a token of an existing connection.
		/// </summary>
		/// <returns></returns>
		public async Task<IdentityResult> UpsertToken(ApplicationUser user, string tokenName, string newTokenValue, Guid connectionId)
		{
			string composedTokenName = $"{tokenName}_{connectionId.ToString()}";
			await userManager.RemoveAuthenticationTokenAsync(user, authSettings.TokenProviderName, composedTokenName); // need to remove it first, otherwise, Set won't work. Apparently by design the record is immutable.
			return await userManager.SetAuthenticationTokenAsync(user, authSettings.TokenProviderName, composedTokenName, newTokenValue);
		}

		/// <summary>
		/// Lookup user tokens and find. There's no explicit checking of expiry date here, 
		/// however, your system should have house keeping functions to regularly clean up expired refresh token, and revoke anytime for any user, selected users and all users.
		/// </summary>
		/// <param name="user"></param>
		/// <param name="purpose">token purpose</param>
		/// <param name="tokenValue"></param>
		/// <param name="connectionId">to become part of composed token name</param>
		/// <returns></returns>
		public async Task<bool> MatchToken(ApplicationUser user, string purpose, string tokenValue, Guid connectionId)
		{
			//var isValid = await userManager.VerifyUserTokenAsync(user, authSettings.TokenProviderName, "RefreshToken", tokenValue); probably no need to call this to avoid mix token purpose usages?
			//and can not handle the expiry of refresh token, or any token needs to be expired. Also, cross machines issues as documented on https://stackoverflow.com/questions/51966010/identity-framework-generateusertoken-validation-issue

			string composedTokenName = $"{purpose}_{connectionId.ToString()}";
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
		/// <param name="isToSignIn">Used by the intial signed in call.</param>
		/// <returns></returns>
		public async Task<ActionResult<AccessTokenResponse>> GenerateJwtToken(ApplicationUser user, string username, string scope, bool isToSignIn = false)
		{
			IList<string> roles = await userManager.GetRolesAsync(user);
			List<Claim> claims = roles.Select(d => new Claim(ClaimTypes.Role, d)).ToList();
			claims.Add(new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.UniqueName, user.UserName));
			TimeSpan span = TimeSpan.FromSeconds(authSettings.AuthTokenExpirySpanSeconds);
			DateTimeOffset expires = DateTimeOffset.UtcNow.Add(span);
			JwtSecurityToken token = new JwtSecurityToken(
				issuer: authSettings.Issuer,
				audience: authSettings.Audience,
				expires: expires.UtcDateTime,
				claims: claims,
				signingCredentials: new SigningCredentials(tokenValidationParameters.IssuerSigningKey, SecurityAlgorithms.HmacSha256)
			);

			string accessToken = new JwtSecurityTokenHandler().WriteToken(token);

			const string tokenPurpose = "RefreshToken";
			var refreshToken = await userManager.GenerateUserTokenAsync(user, authSettings.TokenProviderName, tokenPurpose);

			Guid connectionId = isToSignIn ? Guid.NewGuid() : UserTokenHelper.ExtractConnectionId(scope); //
			await UpsertToken(user, tokenPurpose, refreshToken, connectionId);

			string refinedScope = string.Empty;
			if (isToSignIn)
			{
				refinedScope = string.IsNullOrEmpty(scope) ? $"connectionId:{connectionId}" : $"{scope} connectionId:{connectionId}";
			}
			else
			{
				refinedScope = scope;
			}

			return new AccessTokenResponse()
			{
				access_token = accessToken,
				token_type = "Bearer",
				expires_in = Convert.ToInt32(span.TotalSeconds),
				refresh_token = refreshToken,
				Scope = refinedScope,
			};
			//The token contains roles info as shown at https://jwt.io/

		}

		/// <summary>
		/// Validate accessToken and return the user found in system.
		/// </summary>
		/// <param name="accessToken"></param>
		/// <returns>Null if invalid token or user not found in system.</returns>
		public async Task<ApplicationUser> ValidateAccessToken(string accessToken)
		{
			var handler = new JwtSecurityTokenHandler();
			var jwtSecurityToken = handler.ReadJwtToken(accessToken);
			var uniqueNameClaim = jwtSecurityToken.Claims.Single(d => d.Type == "unique_name");
			var username = uniqueNameClaim.Value;
			var user = await userManager.FindByNameAsync(username);
			if (user == null)
			{
				logger.LogError("uniqueName of token not found the the user table.");
				return null;
			}

			var r = await handler.ValidateTokenAsync(accessToken, tokenValidationParameters); //only string works, object jwtSecurityToken not impleemented in the overload function.
			if (r.IsValid)
			{
				return user;
			}

			return null;
		}

		public static Guid ExtractConnectionId(string scope)
		{
			Guid connectionId;
			if (!string.IsNullOrEmpty(scope))
			{
				var splits = scope.Split(" "); // scopes are separated by spaces
				var found = splits.FirstOrDefault(d => d.StartsWith("connectionId:"));
				if (found != null)
				{
					if (Guid.TryParse(found.Substring(13), out connectionId))
					{
						return connectionId;
					}
				}
			}

			return Guid.NewGuid();
		}

	}

}
