cd $PSScriptRoot
$target="../Release/Core3WebApi/Mac"

Remove-Item -Recurse $target*

dotnet publish -r osx-x64 --output $target --configuration release --self-contained false
