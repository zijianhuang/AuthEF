# Use a published assemblies of Fonlow.EntityFrameworkCore.MyDbEngine.csproj as a plug-in, after running dotnet publish;
# Or use MyDbEngine related assemblies published of Fonlow.EntityFrameworkCore.MyDbEngine.csproj as a plug-in;
# There may be other ways, depending how you would test and deploy.
cd $PSScriptRoot
$netVersion = "net8.0"
#dotnet publish ../Fonlow.EntityFrameworkCore.Sqlite/Fonlow.EntityFrameworkCore.Sqlite.csproj --configuration Release --output bin/Release/$netVersion
$connectionString = "Data Source=../Core3WebApi/DemoApp_Data/auth.db"
bin/Release/net8.0/AuthDbCreator.exe Fonlow.EntityFrameworkCore.Sqlite $connectionString