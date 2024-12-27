# Because of decoupling from DB engines, the Web API needs the assemblies of a specific DB engine plugin.
# This script is to publish MySql plugin to the Web API release build during development.
# During deployment, system admin may switch to a DB engine with a bare deployment of the Web API, and copy the plugin assmeblies, and then adjust the appsetting.json file.
Set-Location $PSScriptRoot
$netVersion = "net9.0"
$RuntimeId = ([System.Runtime.InteropServices.RuntimeInformation]::RuntimeIdentifier.ToString())
Write-Output $RuntimeId
dotnet publish ./Fonlow.EntityFrameworkCore.MySql/Fonlow.EntityFrameworkCore.MySql.csproj -r $RuntimeId --configuration Debug --output ./Core3WebApi/bin/Debug/$netVersion