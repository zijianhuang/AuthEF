IDbEngineDbContext for an implementation that will initialize [Microsoft.EntityFrameworkCore.DbContextOptionsBuilder](https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.dbcontextoptionsbuilder) with a specific DB engine driver/lib.

DbEngineDbContextLoader is a factory class to load a concrete type of IDbEngineDbContext through reflection.
