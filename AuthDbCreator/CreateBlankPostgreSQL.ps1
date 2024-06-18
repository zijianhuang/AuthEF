cd $PSScriptRoot
$connectionString = "host=localhost;port=5432;username=postgres; password=zzzzzzzz; database=DemoAppAuth_Test; Persist Security Info=True"
bin/Debug/net8.0/AuthDbCreator.exe Fonlow.EntityFrameworkCore.PostgreSQL $connectionString