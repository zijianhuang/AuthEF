# For Sqlite, the cascade loading of assemblies is not working well with reflection probably due to some native runtime dll files of Sqlite have to be used.
# Error: Unhandled exception. System.TypeInitializationException: The type initializer for 'Microsoft.Data.Sqlite.SqliteConnection' threw an exception.
# And it seems that the .NET runtime can only resolve through AuthDbCreator.deps.json rather than Fonlow.EntityFrameworkCore.Sqlite.deps.json, 
# since Microsoft.Data.Sqlite.dll has no knowledge of Fonlow.EntityFrameworkCore.Sqlite.deps.json nor the runtimes folder.
cd $PSScriptRoot
$netVersion = "net8.0"
copy-item -Path ../Fonlow.EntityFrameworkCore.Sqlite/bin/Release/$netVersion/publish/* -Destination bin/Release/$netVersion/ -Filter *Sqlite*
# Copy the Windows native dll of Sqlite
copy-item -Path ../Fonlow.EntityFrameworkCore.Sqlite/bin/Release/$netVersion/publish/runtimes/win-x64/native/e_sqlite3.dll -Destination bin/Release/$netVersion/
$connectionString = "Data Source=../Core3WebApi/DemoApp_Data/auth.db"
bin/Release/net8.0/AuthDbCreator.exe Fonlow.EntityFrameworkCore.Sqlite $connectionString