cd $PSScriptRoot
$connectionString = "server=localhost;port=3306;Uid=root; password=zzzzzzzz; database=DemoAppAuth_Test; Persist Security Info=True;Allow User Variables=true"
bin/Debug/net8.0/AuthDbCreator.exe Fonlow.EntityFrameworkCore.MySql $connectionString