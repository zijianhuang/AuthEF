# For Sqlite, the cascade loading of assemblies is not working well with reflection probably due to some native runtime dll files of Sqlite have to be used.
# Error: Unhandled exception. System.TypeInitializationException: The type initializer for 'Microsoft.Data.Sqlite.SqliteConnection' threw an exception.
# And it seems that the .NET runtime can only resolve through AuthDbCreator.deps.json rather than Fonlow.EntityFrameworkCore.Sqlite.deps.json, 
# since Microsoft.Data.Sqlite.dll has no knowledge of Fonlow.EntityFrameworkCore.Sqlite.deps.json nor the runtimes folder.
# 2 solutions:
# 1. Copy all assemblies related to Sqlite, and copy the native e_sqlte3.* of specific OS from the runtimes folder.
# 2. Use "dotnet publish -r WhatOS" to let dotnet choose the right one.
cd $PSScriptRoot
$netVersion = "net8.0"
dotnet publish ../Fonlow.EntityFrameworkCore.Sqlite/Fonlow.EntityFrameworkCore.Sqlite.csproj  -r win-x64 --configuration Release --output bin/Release/$netVersion
$connectionString = "Data Source=../Core3WebApi/DemoApp_Data/auth.db"
bin/Release/net8.0/AuthDbCreator.exe Fonlow.EntityFrameworkCore.Sqlite $connectionString