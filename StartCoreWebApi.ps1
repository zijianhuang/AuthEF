#Launch WebApi Website and POST a request for generating client APIs
Set-Location $PSScriptRoot
$path = "$PSScriptRoot\Core3WebApi\bin\Release\net8.0"
$ExecutableExt = If ($IsWindows) {".exe"} Else {""}

$procArgs = @{
    FilePath         = "$path\Core3WebApi"+$ExecutableExt
    WorkingDirectory = $path
    PassThru         = $true
}
$process = Start-Process @procArgs

