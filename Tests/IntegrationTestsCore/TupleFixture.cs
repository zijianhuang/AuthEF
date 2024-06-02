﻿using Fonlow.DateOnlyExtensions;
using Fonlow.Testing;
using System;

namespace IntegrationTests
{
	public class TupleFixture : BasicHttpClient
	{
		public TupleFixture()
		{
			var jsonSerializerSettings = new Newtonsoft.Json.JsonSerializerSettings()
			{
				NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore,
			};

			jsonSerializerSettings.Converters.Add(new DateOnlyJsonConverter());
			jsonSerializerSettings.Converters.Add(new DateOnlyNullableJsonConverter());

			var c = TestingSettings.Instance.ServiceCommands[0];
			this.HttpClient.BaseAddress = new System.Uri(c.BaseUrl);
			Api = new DemoWebApi.Controllers.Client.Tuple(HttpClient, jsonSerializerSettings);
		}

		public DemoWebApi.Controllers.Client.Tuple Api { get; private set; }
	}
}
