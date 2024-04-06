:: pack existing release build
set packCmd=dotnet pack --no-build --output C:\NugetLocalFeeds --configuration Release
%packCmd% Fonlow.AspNetCore.Identity/Fonlow.AspNetCore.Identity.csproj
%packCmd% Fonlow.EntityFrameworkCore.Abstract/Fonlow.EntityFrameworkCore.Abstract.csproj
%packCmd% Fonlow.EntityFrameworkCore.MySql/Fonlow.EntityFrameworkCore.MySql.csproj
%packCmd% Fonlow.EntityFrameworkCore.Sqlite/Fonlow.EntityFrameworkCore.Sqlite.csproj
%packCmd% Fonlow.WebApp.Accounts/Fonlow.WebApp.Accounts.csproj
%packCmd% Fonlow.AuthDbCreator/Fonlow.AuthDbCreator.csproj
%packCmd% Fonlow.AspNetCore.Identity.Account/Fonlow.AspNetCore.Identity.Account.csproj


