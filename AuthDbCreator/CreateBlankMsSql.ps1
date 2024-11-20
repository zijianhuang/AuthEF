#requires -PSEdition Core
Set-Location $PSScriptRoot
$netVersion = "net9.0"
$RuntimeId = ([System.Runtime.InteropServices.RuntimeInformation]::RuntimeIdentifier.ToString())
$ExecutableExt = If ($IsWindows) {".exe"} Else {""}
dotnet publish ../Fonlow.EntityFrameworkCore.MySql/Fonlow.EntityFrameworkCore.MySql.csproj -r $RuntimeId --configuration Release --output bin/Release/$netVersion
$connectionString = "Server=localhost,1433;Database=DemoAppAuth_Test;User Id=sa;Password=Secured321*; TrustServerCertificate=True;"
$CreatorExe = "AuthDbCreator" + $ExecutableExt;
Invoke-Expression "&./bin/Release/net9.0/$CreatorExe Fonlow.EntityFrameworkCore.MySql '$connectionString'"