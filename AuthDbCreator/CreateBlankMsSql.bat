rem Create Sqlite DB for Core3WebApi
cd %~dp0
set "connectionString=Server=localhost,1433;Database=DemoAppAuth_Test;User Id=sa;Password=Zzzzzz*8; TrustServerCertificate=True;"
set roleNamesCsv=admin,manager,staff,user,api

bin\Debug\net8.0\AuthDbCreator.exe Fonlow.EntityFrameworkCore.MsSql "%connectionString%"