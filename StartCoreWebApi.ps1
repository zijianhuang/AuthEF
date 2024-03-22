﻿#Launch WebApi Website and POST a request for generating client APIs
cd $PSScriptRoot
$path = "$PSScriptRoot\Core3WebApi\bin\Debug\net8.0"
$procArgs = @{
    FilePath         = "dotnet.exe"
    ArgumentList     = "$path\Core3WebApi.dll"
    WorkingDirectory = $path
    PassThru         = $true
}
$process = Start-Process @procArgs

Invoke-RestMethod http://localhost:5000/api/DateTypes/GetDateTimeOffset -Method GET
Invoke-RestMethod http://localhost:5000/api/DateTypes/GetDateOnly -Method GET

