[Microsoft.EntityFrameworkCore.DbContextOptionsBuilder](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder) provides a simple API surface for configuring DbContextOptions. Databases (and other extensions) typically define extension methods on this object that allow you to configure the database connection (and other options) to be used for a context. Then through software design, you can decouple the business modules or DAL from concrete database engines.

For Dependency Injection, `IDbEngineDbContext` can be used with various design patterns of IoC, as well as .NET reflection.

Example codes are provided in Core3WebApi/Program.cs with reflection.

This library is for MS SQL Server.

## Docker

Whether to use docker, it is a concern of deployment. However, these days, since the popularity of container technologies, using docker or alike is convenient for integration testing and CI. And in the CD pipeline, you don't have to use container even if your CI uses container.

References:
* [Run SQL Server Linux container images with Docker](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-ver16&tabs=cli&pivots=cs1-powershell)

After you pull a SQL Server image, use the following to established a docker instance:

```
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=Secured321*" `
   -p 1433:1433 --name demosql --hostname demosql `
   -d `
   mcr.microsoft.com/mssql/server:2022-latest
```

