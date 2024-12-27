[Microsoft.EntityFrameworkCore.DbContextOptionsBuilder](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder) provides a simple API surface for configuring DbContextOptions. Databases (and other extensions) typically define extension methods on this object that allow you to configure the database connection (and other options) to be used for a context. Then through software design, you can decouple the business modules or DAL from concrete database engines.

For Dependency Injection, `IDbEngineDbContext` can be used with various design patterns of IoC, as well as .NET reflection.

During development or pushing to GitHub repos, `PublishMySqlPluginToWebApi.ps1` or `PublishMySqlPluginToWebApiDebug.ps1` will copy needed decoupled dependency to the deployable of Core3WebApi.

Example codes are provided in Core3WebApi/Program.cs with reflection.

This library is for MySql.

## Docker

References:

* [MariaDb](https://hub.docker.com/_/mariadb)

After pulling the MySql/MariaDb image, use the following to launch:

```
docker run --name demomysql -p:3306:3306 -e MYSQL_ROOT_PASSWORD=Secured321* -d mysql:latest
```

or 

```
docker run --name demomariadb --detach -p:3306:3306 -e MARIADB_ROOT_PASSWORD=Secured321* -d mariadb:latest
```