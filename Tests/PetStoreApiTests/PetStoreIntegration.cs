﻿using Fonlow.Net.Http;
using My.Pet.Client;
using System;
using System.Threading.Tasks;
using Xunit;
using Fonlow.Testing;
using System.Net.Http.Headers;

namespace IntegrationTests
{
	public class PetsFixture : DefaultHttpClientWithUsername
	{
		public PetsFixture()
		{
			Uri baseUri = new("http://localhost:6000");

			httpClient = new System.Net.Http.HttpClient
			{
				BaseAddress = baseUri,
			};

			httpClient.DefaultRequestHeaders.Authorization = AuthorizedClient.DefaultRequestHeaders.Authorization;

			Api = new PetClient(httpClient, new Newtonsoft.Json.JsonSerializerSettings()
			{
				NullValueHandling= Newtonsoft.Json.NullValueHandling.Ignore
			});
		}

		public PetClient Api { get; private set; }

		readonly System.Net.Http.HttpClient httpClient;

		#region IDisposable pattern
		bool disposed;

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		protected virtual void Dispose(bool disposing)
		{
			if (!disposed)
			{
				if (disposing)
				{
					httpClient.Dispose();
				}

				disposed = true;
			}
		}
		#endregion
	}

	public partial class PetsApiIntegration : IClassFixture<PetsFixture>
	{
		public PetsApiIntegration(PetsFixture fixture)
		{
			api = fixture.Api;
		}

		readonly PetClient api;

		[Fact]
		public async Task TestFindPets()
		{
			Pet[] aa = await api.FindPetsByStatusAsync(PetStatus.sold);
			Assert.Equal(3, aa.Length);
		}

		[Fact]
		public async Task TestFindPetsByTags()
		{
			Pet[] aa = await api.FindPetsByTagsAsync(["something", "nothing"]);
			Assert.Empty(aa);
		}

		[Fact]
		public async Task TestFindPetsByEmptyTags()
		{
			await Assert.ThrowsAsync<Fonlow.Net.Http.WebApiRequestException>(() => api.FindPetsByTagsAsync([]));
		}

		[Fact]
		public async Task TestFindPetsBy4Tags()
		{
			await Assert.ThrowsAsync<Fonlow.Net.Http.WebApiRequestException>(() => api.FindPetsByTagsAsync(["1", "2", "3", "4"]));
		}

		[Fact]
		public async Task TestGetPet()
		{
			Pet d = await api.GetPetByIdAsync(12);
			Assert.Equal("Narco", d.Name);
		}

		[Fact]
		public async Task TestAddPet()
		{
			await api.AddPetAsync(new Pet()
			{
				//Id=339,
				Name = "KKK", //required
				PhotoUrls = new string[] { "http://somewhere.com/mydog.jpg" }, //required,
				Tags = new Tag[] { //not required. However, when presented, it must contain at least one item.
					new Tag()
					{
						//Id=3,
						Name="Hey"
					}
				},
			});
		}


		[Fact]
		public async Task TestPetsDelete()
		{
			WebApiRequestException ex = await Assert.ThrowsAsync<WebApiRequestException>(() => api.DeletePetAsync(9));
			Assert.Equal("NoSuchPet", ex.Response);
		}

	}
}
