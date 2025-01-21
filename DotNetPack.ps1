$packCmd = 'dotnet pack $Name --no-build --output C:/NugetLocalFeeds --configuration Release'
$projList = 'Fonlow.AspNetCore.Identity/Fonlow.AspNetCore.Identity.csproj', 'Fonlow.EntityFrameworkCore.Abstract/Fonlow.EntityFrameworkCore.Abstract.csproj', 'Fonlow.EntityFrameworkCore.MySql/Fonlow.EntityFrameworkCore.MySql.csproj', 'Fonlow.EntityFrameworkCore.Sqlite/Fonlow.EntityFrameworkCore.Sqlite.csproj', 'Fonlow.EntityFrameworkCore.MsSql/Fonlow.EntityFrameworkCore.MsSql.csproj', 'Fonlow.WebApp.Accounts/Fonlow.WebApp.Accounts.csproj', 'Fonlow.AuthDbCreator/Fonlow.AuthDbCreator.csproj', 'Fonlow.AspNetCore.Identity.Account/Fonlow.AspNetCore.Identity.Account.csproj', 
  'Fonlow.Auth.Models/Fonlow.Auth.Models.csproj',
  'Fonlow.Auth.TokenClient/Fonlow.Auth.tokenClient.csproj'

foreach($name in $projList){
    Invoke-Expression $ExecutionContext.InvokeCommand.ExpandString($packCmd)
}