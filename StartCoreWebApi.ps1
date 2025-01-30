#Launch WebApi Website and POST a request for generating client APIs
#If the Website is with MySql DB, run PublishMySqlPluginToWebApi.ps1 or PublishMySqlPluginToWebApiDebug.ps1 while by default the site is with Sqlite plugin only.
Set-Location $PSScriptRoot
$path = "$PSScriptRoot\Core3WebApi\bin\Debug\net9.0"
$ExecutableExt = If ($IsWindows) {".exe"} Else {""}

$procArgs = @{
    FilePath         = "$path\Core3WebApi"+$ExecutableExt
    WorkingDirectory = $path
    PassThru         = $true
}
$process = Start-Process @procArgs

