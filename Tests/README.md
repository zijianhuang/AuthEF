AuthTests and IntegrationTestsCore will launch the same Web API service and the quit. By Default, Core3WebApi will use MySql/Maria as DB engine. During development, you may use other database engines.

**Hints**
* Before running tests, run "CreateBlankMySql.ps1" (Powershell 7) of AuthDbCreator first to create a local database.
* It is recommended that you use docker to launch various DB engines.


**Remarks**
* When using Sqlite, extra care needs to be taken when runing 2 integration test suites. If you run "VS Run All" or select both and run, this may cause dead locking of the Sqlite DB, because the second launch may try to have a write lock on the DB, while the shutdown of the first launch may not be finished thus keeping the write lock.
* Therefore, you should run these 2 one by one, when utilizing Sqlite.
* When running integration test suites, GitHub Actions may run time in parallel, therefore, using Sqlite as DB engine will cause some tests fail because of potential locking of the DB file.