cd $PSScriptRoot
$target="../Release/PetWebApi/Mac"

Remove-Item -Recurse $target*

dotnet publish -r osx-x64 --output $target --configuration release --self-contained false
