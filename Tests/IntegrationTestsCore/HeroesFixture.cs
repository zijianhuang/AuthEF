using Fonlow.Testing;
using System;

namespace IntegrationTests
{
	public class HeroesFixture : AuthEfHttpClientWithUsername
	{
		public HeroesFixture()
		{
			Api = new DemoWebApi.Controllers.Client.Heroes(AuthorizedClient);
		}

		public DemoWebApi.Controllers.Client.Heroes Api { get; private set; }
	}


}
