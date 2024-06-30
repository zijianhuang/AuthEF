using Fonlow.Testing;
using System;

namespace IntegrationTests
{
	public class ValuesFixture : BasicHttpClient
	{
		public ValuesFixture()
		{
			var c = TestingSettings.Instance.ServiceCommands["LaunchWebApi"];
			this.HttpClient.BaseAddress = new System.Uri(c.BaseUrl);
			Api = new DemoWebApi.Controllers.Client.Values(HttpClient);
		}

		public DemoWebApi.Controllers.Client.Values Api { get; private set; }
	}

}
