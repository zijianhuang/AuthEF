# Use a published assemblies of Fonlow.EntityFrameworkCore.MyDbEngine.csproj as a plug-in, after running dotnet publish;
# Or use MyDbEngine related assemblies published of Fonlow.EntityFrameworkCore.MyDbEngine.csproj as a plug-in;
# There may be other ways, depending how you would test and deploy.
cd $PSScriptRoot
$netVersion = "net8.0"
dotnet publish ../Fonlow.EntityFrameworkCore.MySql/Fonlow.EntityFrameworkCore.MySql.csproj -r linux-x64 --configuration Release --output bin/Release/$netVersion
#copy-item -Path ../Fonlow.EntityFrameworkCore.MySql/bin/Release/$netVersion/publish/* -Destination bin/Release/$netVersion/ -Filter *MySql*
$connectionString = "server=localhost;port=3306;Uid=root; password=Secured321*; database=DemoAppAuth_Test; Persist Security Info=True;Allow User Variables=true"
bin/Release/net8.0/AuthDbCreator Fonlow.EntityFrameworkCore.MySql $connectionString