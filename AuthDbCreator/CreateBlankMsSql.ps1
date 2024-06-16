cd $PSScriptRoot
$connectionString = "Server=localhost,1433;Database=DemoAppAuth_Test;User Id=sa;Password=Zzzzzz*8; TrustServerCertificate=True;"
bin/Debug/net8.0/AuthDbCreator.exe Fonlow.EntityFrameworkCore.MsSql $connectionString