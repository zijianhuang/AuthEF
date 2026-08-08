Set-Location $PSScriptRoot
dotnet test --verbosity normal --configuration Release --no-build --max-parallel-test-modules 1 --solution AuthEf.slnx