﻿using DemoWebApi.Controllers.Client;
using Fonlow.Net.Http;
namespace Fonlow.Heroes.VM
{
	public static class HeroesFunctions
	{
		static readonly Uri apiUri = new Uri("https://heroes.fonlow.net/webapi/"); //replace url with what in your dev environment
		//static readonly Uri apiUri = new Uri("http://10.0.2.2:5000/");

		public static Hero[] LoadHeroes()
		{
			try
			{
				using (var httpClient = new System.Net.Http.HttpClient())
				{
					httpClient.BaseAddress = apiUri;
					var api = new DemoWebApi.Controllers.Client.Heroes(httpClient);
					return api.GetHeros();
				}
			}
			catch (WebApiRequestException ex)
			{
				System.Diagnostics.Trace.TraceError(ex.ToString());
				throw;
			}
		}

		public static async Task<Hero[]> SearchAsync(string keyword)
		{
			try
			{
				using (var httpClient = new System.Net.Http.HttpClient())
				{
					httpClient.BaseAddress = apiUri;
					var api = new DemoWebApi.Controllers.Client.Heroes(httpClient);
					return await api.SearchAsync(keyword);
				}
			}
			catch (WebApiRequestException ex)
			{
				System.Diagnostics.Trace.TraceError(ex.ToString());
				throw;
			}
		}

		public static Hero LoadHero(long id)
		{
			try
			{
				using (var httpClient = new System.Net.Http.HttpClient())
				{
					httpClient.BaseAddress = apiUri;
					var api = new DemoWebApi.Controllers.Client.Heroes(httpClient);
					return api.GetHero(id);
				}
			}
			catch (WebApiRequestException ex)
			{
				System.Diagnostics.Trace.TraceError(ex.ToString());
				throw;
			}
		}

		public static async Task SaveAsync(Hero hero)
		{
			try
			{
				using (var httpClient = new System.Net.Http.HttpClient())
				{
					httpClient.BaseAddress = apiUri;
					var api = new DemoWebApi.Controllers.Client.Heroes(httpClient);
					await api.PutAsync(hero);
				}
			}
			catch (WebApiRequestException ex)
			{
				System.Diagnostics.Trace.TraceError(ex.ToString());
				throw;
			}
		}

		public static async Task DeleteAsync(long id)
		{
			try
			{
				using (var httpClient = new System.Net.Http.HttpClient())
				{
					httpClient.BaseAddress = apiUri;
					var api = new DemoWebApi.Controllers.Client.Heroes(httpClient);
					await api.DeleteAsync(id);
				}
			}
			catch (WebApiRequestException ex)
			{
				System.Diagnostics.Trace.TraceError(ex.ToString());
				throw;
			}
		}

		public static async Task<Hero> AddAsync(string name)
		{
			try
			{
				using (var httpClient = new System.Net.Http.HttpClient())
				{
					httpClient.BaseAddress = apiUri;
					var api = new DemoWebApi.Controllers.Client.Heroes(httpClient);
					return await api.PostAsync(name);
				}
			}
			catch (WebApiRequestException ex)
			{
				System.Diagnostics.Trace.TraceError(ex.ToString());
				throw;
			}
		}


	}
}