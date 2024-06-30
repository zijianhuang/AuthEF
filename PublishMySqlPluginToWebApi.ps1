#Launch WebApi Website and POST a request for generating client APIs
Set-Location $PSScriptRoot
$netVersion = "net8.0"
$RuntimeId = ([System.Runtime.InteropServices.RuntimeInformation]::RuntimeIdentifier.ToString())
Write-Output $RuntimeId
dotnet publish ./Fonlow.EntityFrameworkCore.MySql/Fonlow.EntityFrameworkCore.MySql.csproj -r $RuntimeId --configuration Release --output ./Core3WebApi/bin/Release/$netVersion