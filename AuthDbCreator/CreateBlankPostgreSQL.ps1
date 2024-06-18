# Use a published assemblies of Fonlow.EntityFrameworkCore.MyDbEngine.csproj as a plug-in, after running dotnet publish;
# Or use MyDbEngine related assemblies published of Fonlow.EntityFrameworkCore.MyDbEngine.csproj as a plug-in;
# There may be other ways, depending how you would test and deploy.
cd $PSScriptRoot
$netVersion = "net8.0"
#dotnet publish ../Fonlow.EntityFrameworkCore.PostgreSQL/Fonlow.EntityFrameworkCore.PostgreSQL.csproj --configuration Release --output bin/Release/$netVersion
copy-item -Path ../Fonlow.EntityFrameworkCore.PostgreSQL/bin/Release/$netVersion/publish/* -Destination bin/Release/$netVersion/ -Filter *Npgsql*
copy-item -Path ../Fonlow.EntityFrameworkCore.PostgreSQL/bin/Release/$netVersion/publish/* -Destination bin/Release/$netVersion/ -Filter *PostgreSQL*
$connectionString = "server=localhost;port=5432;username=postgres; password=zzzzzzzz; database=DemoAppAuth_Test; Persist Security Info=True"
bin/Release/net8.0/AuthDbCreator.exe Fonlow.EntityFrameworkCore.PostgreSQL $connectionString