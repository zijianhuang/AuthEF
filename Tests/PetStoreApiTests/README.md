This is to test PetStore Web API that requires authentication and authorization however without built-in auth and login features, but simily trust the bearer token of agreeed server side secret.

Prerequsites:
1. Launch "Core3WebApi" via "StartCoreWebApi.ps1" on localhost:5000. And this provide auth service.
1. Launch Pet Store Web API via "StartPetStoreApi.ps1 on localhost:6000. And this one has not built-in auth and login feature, however, share the service side secret through the startup codes.


Then run this test suite.

The test suite will talke to localhost:5000 to obtain OAuth bearer token, then use it to talk to localhost:6000.