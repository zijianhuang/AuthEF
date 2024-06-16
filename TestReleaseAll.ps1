cd $PSScriptRoot
dotnet test --verbosity normal --configuration Release --no-build --filter FullyQualifiedName!~RemoteTests