#requires -PSEdition Core
# Use a published assemblies of Fonlow.EntityFrameworkCore.MyDbEngine.csproj as a plug-in, after running dotnet publish;
# Or use MyDbEngine related assemblies published of Fonlow.EntityFrameworkCore.MyDbEngine.csproj as a plug-in;
# There may be other ways, depending how you would test and deploy.
Set-Location $PSScriptRoot
$netVersion = "net8.0"
$RuntimeId = ([System.Runtime.InteropServices.RuntimeInformation]::RuntimeIdentifier.ToString())
$ExecutableExt = If ($IsWindows) {".exe"} Else {""}
dotnet publish ../Fonlow.EntityFrameworkCore.MySql/Fonlow.EntityFrameworkCore.MySql.csproj -r $RuntimeId --configuration Release --output bin/Release/$netVersion
$connectionString = "server=localhost;port=3306;Uid=root; password=Secured321*; database=DemoAppAuth_Test; Persist Security Info=True;Allow User Variables=true"
$CreatorExe = "AuthDbCreator" + $ExecutableExt
Invoke-Expression "&./bin/Release/net8.0/$CreatorExe Fonlow.EntityFrameworkCore.MySql '$connectionString'"