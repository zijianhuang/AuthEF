cd $PSScriptRoot
$target="../Release/PetWebApi/Win"

Remove-Item -Recurse $target*

dotnet publish -r win-x64 --output $target --configuration release --self-contained false
