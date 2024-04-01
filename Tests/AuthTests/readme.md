Test the correctness of auth protocol implementation. The expiry time of access token is 5 seconds. Therefore, to test the life cycle of various tokens, Thread.Sleep() is used to simulate real world scenarios.

There are also a few simple stress tests to test the speeds of different ways of utilizing HttpClient, thus the test suite may take half-minute to a few minutes to run.

The default ClockSkew in ASP.NET (Core) as well as other MS net libs and products is 5 minutes, however, in the DEBUG build, the ClockSkew is 2 seconds. Therefore, the test cases should run upon only the debug build of the Web API.


In addition to testing correctness, this test suite:
1. Demostrate the performances of using the same HttpClient instance, and new instance per request.
1. Demostrate the time used of accquiring access token through username/password, and through refreshToken.


**Remarks:**

* HttpClient is threadsafe supporting concurrent usages.