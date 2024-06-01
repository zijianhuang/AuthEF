[Microsoft.EntityFrameworkCore.DbContextOptionsBuilder](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder) provides a simple API surface for configuring DbContextOptions. Databases (and other extensions) typically define extension methods on this object that allow you to configure the database connection (and other options) to be used for a context. Then through software design, you can decouple the business modules or DAL from concrete database engines.

For Dependency Injection, `IDbEngineDbContext` can be used with various design patterns of IoC, as well as .NET reflection.

Example codes are provided in Core3WebApi/Program.cs with reflection.

This library is for Sqlite.
