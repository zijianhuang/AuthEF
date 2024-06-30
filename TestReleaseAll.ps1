Set-Location $PSScriptRoot
# Presuming the sln has be build as release, and the DB engine has been established.
./PublishMySqlPluginToWebApi.ps1
dotnet test -m:1 AuthEF.sln --verbosity normal --configuration Release --no-build -p:TestTfmsInParallel=false --filter FullyQualifiedName!~RemoteTests