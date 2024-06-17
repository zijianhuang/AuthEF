cd $PSScriptRoot
$target="../Release/Core3WebApi/Win"

Remove-Item -Recurse $target*

dotnet publish -r win-x64 --output $target --configuration release --self-contained false
