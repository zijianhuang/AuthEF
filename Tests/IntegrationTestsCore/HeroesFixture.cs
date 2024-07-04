using Fonlow.Testing;
using System;

namespace IntegrationTests
{
	public class HeroesFixture : AuthEfHttpClientWithUsername
	{
		public HeroesFixture()
		{
			System.Text.Json.JsonSerializerOptions jsonSerializerSettings = new System.Text.Json.JsonSerializerOptions()
			{
				DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull,
				PropertyNameCaseInsensitive = true,
				NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString, // newtonsoft.json along with converters may return long and int128 as string
			};

			Api = new DemoWebApi.Controllers.Client.Heroes(AuthorizedClient, jsonSerializerSettings);
		}

		public DemoWebApi.Controllers.Client.Heroes Api { get; private set; }
	}


}
