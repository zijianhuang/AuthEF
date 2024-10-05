#requires -PSEdition Core
# For Sqlite, the cascade loading of assemblies is not working well with reflection probably due to some native runtime dll files of Sqlite have to be used.
# Error: Unhandled exception. System.TypeInitializationException: The type initializer for 'Microsoft.Data.Sqlite.SqliteConnection' threw an exception.
# And it seems that the .NET runtime can only resolve through AuthDbCreator.deps.json rather than Fonlow.EntityFrameworkCore.Sqlite.deps.json, 
# since Microsoft.Data.Sqlite.dll has no knowledge of Fonlow.EntityFrameworkCore.Sqlite.deps.json nor the runtimes folder.
# 2 solutions:
# 1. Copy all assemblies related to Sqlite, and copy the native e_sqlte3.* of specific OS from the runtimes folder.
# 2. Use "dotnet publish -r WhatOS" to let dotnet choose the right one.
Set-Location $PSScriptRoot
$netVersion = "net8.0"
$RuntimeId = ([System.Runtime.InteropServices.RuntimeInformation]::RuntimeIdentifier.ToString())
$ExecutableExt = If ($IsWindows) {".exe"} Else {""}
dotnet publish ../Fonlow.EntityFrameworkCore.MySql/Fonlow.EntityFrameworkCore.MySql.csproj -r $RuntimeId --configuration Release --output bin/Release/$netVersion
$connectionString = "Data Source=../Core3WebApi/DemoApp_Data/auth.db"
$CreatorExe = "AuthDbCreator" + $ExecutableExt;
Invoke-Expression "&./bin/Release/net8.0/$CreatorExe Fonlow.EntityFrameworkCore.MySql '$connectionString'"