Web API to test the authentication and authorization in typical scenarios.

**Remarks:**

* The default DB engine is Sqlite while it may be easier to use MySql sometimes.
* During development or pushing to GitHub repos, `PublishMySqlPluginToWebApi.ps1` or `PublishMySqlPluginToWebApiDebug.ps1` will copy needed decoupled dependency to the deployable of Core3WebApi.
* In the debug build, the clock skew is 2 seconds, while in the release build, the clock skew is not defined thus it is 5 minutes by default.