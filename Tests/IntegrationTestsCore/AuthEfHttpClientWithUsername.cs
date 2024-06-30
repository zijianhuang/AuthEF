using System;
using System.Net.Http;
namespace Fonlow.Testing
{
	/// <summary>
	/// Provide an authorized HttpClient instance with uri and username/password defined in appsettings.json:
	/// BaseUrl, Username and Password.
	/// </summary>
	public class AuthEfHttpClientWithUsername : HttpClientWithUsername
	{
		public AuthEfHttpClientWithUsername() : this(null)
		{

		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="handler">Default AcceptAnyCertificateHandler. Injected handler should generally contains ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator </param>
		public AuthEfHttpClientWithUsername(HttpMessageHandler handler) : base(new Uri(TestingSettings.Instance.ServiceCommands["LaunchWebApi"].BaseUrl), TestingSettings.Instance.ServiceCommands["LaunchWebApi"].Users[0].Username, TestingSettings.Instance.ServiceCommands["LaunchWebApi"].Users[0].Password, handler)
		{

		}
	}

}
