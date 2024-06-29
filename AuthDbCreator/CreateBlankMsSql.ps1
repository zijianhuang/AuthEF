cd $PSScriptRoot
cd $PSScriptRoot
$netVersion = "net8.0"
dotnet publish ../Fonlow.EntityFrameworkCore.MsSql/Fonlow.EntityFrameworkCore.MsSql.csproj -r win-x64 --configuration Release --output bin/Release/$netVersion

$connectionString = "Server=localhost,1433;Database=DemoAppAuth_Test;User Id=sa;Password=Secured321*; TrustServerCertificate=True;"
bin/Release/net8.0/AuthDbCreator.exe Fonlow.EntityFrameworkCore.MsSql $connectionString