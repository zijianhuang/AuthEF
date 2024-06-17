cd $PSScriptRoot
dotnet test -m:1 AuthEF.sln --verbosity normal --configuration Release --no-build -p:TestTfmsInParallel=false --filter FullyQualifiedName!~RemoteTests