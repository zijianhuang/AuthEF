﻿using Fonlow.Net.Http;
using Fonlow.Testing;
using My.Pet.Client;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace IntegrationTests
{
	public partial class PetStoreNegativeFacts : IClassFixture<PetsFixture>
	{
		public PetStoreNegativeFacts(PetsFixture fixture)
		{
			api = fixture.Api;
		}

		readonly PetClient api;

		[Fact]
		public async Task TestFindPetsTokenExpiresThrows()
		{
			Pet[] aa = await api.FindPetsByStatusAsync(PetStatus.sold);
			Assert.Equal(3, aa.Length);
			Thread.Sleep(7050);
			var ex = await Assert.ThrowsAsync<WebApiRequestException>(() => api.FindPetsByStatusAsync(PetStatus.sold));
			Assert.Equal(System.Net.HttpStatusCode.Unauthorized, ex.StatusCode);
		}
	}
}