cd $PSScriptRoot
dotnet test -m:1 AuthEF.sln --verbosity normal --configuration Release --no-build --filter FullyQualifiedName!~RemoteTests