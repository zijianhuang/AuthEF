Test the correctness of auth protocol implementation.

The default ClockSkew in ASP.NET (Core) as well as other MS net libs and products is 5 minutes, however, in the DEBUG build, the ClockSkew is 5 seconds. Therefore, the test cases should run upon only the debug build of the Web API.

In addition to testing correctness, this test suite:
1. Demostrate the performances of using the same HttpClient instance, and new instance per request.
1. Demostrate the time used of accquiring access token through username/password, and through refreshToken.


**Remarks:**

* HttpClient is threadsafe supporting concurrent usages.