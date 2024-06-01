AuthTests and IntegrationTestsCore will launch the same Web API service and the quit. By Default, Core3WebApi will use Sqlite as DB engine. During development, you may use MySql/Maria DB.


**Remarks**
* When using Sqlite, extra care needs to be taken when runing 2 integration test suites. If you run "VS Run All" or select both and run, this may cause dead locking of the Sqlite DB, because the second launch may try to have a write lock on the DB, while the shutdown of the first launch may not be finished thus keeping the write lock.
* Therefore, you should run these 2 one by one, when utilizing Sqlite.