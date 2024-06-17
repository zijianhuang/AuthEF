using Fonlow.Testing;
using System;

namespace IntegrationTests
{
	public class SpecialTypesFixture : AuthEfHttpClientWithUsername
	{
		public SpecialTypesFixture()
		{
			Api = new DemoCoreWeb.Controllers.Client.SpecialTypes(AuthorizedClient);
		}

		public DemoCoreWeb.Controllers.Client.SpecialTypes Api { get; private set; }
	}
}
