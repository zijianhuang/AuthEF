This repository serves multiple purposes:
1. Demonstrate "[Decouple ASP.NET Core Identity, Authentication and Database Engines](https://www.codeproject.com/Articles/5378824/Decouple-ASP-NET-Core-Identity-Authentication-and)"
2. Demonstrate "[Share Identity Bear Tokens among ASP.NET Core Web APIs](https://www.codeproject.com/Articles/5382165/Share-Identity-Bear-Tokens-among-ASP-NET-Core-Web)" 
3. Demonstrate "[Resource Owner Password Credentials Grant and Refreshing Token with ASP.NET Core Identity](https://www.codeproject.com/Articles/5385175/ROPC-and-Refresh-Token-with-ASP-NET-Core-Identity)"
4. Provide some plugin components that decouple business modules from concrete SQL database engines.
5. Provide some components that decouple ASP.NET Core Identity with concrete database engines.
6. Demonstrate how to craft integration tests and run on local dev PC as much as possible, and the artifacts could be easily reused in a team CI server like GitHub Actions/Workflow.

## Decoupling Entity Framework and DB Engines

Provides a few libraries to decouple business modules from concrete SQL database engines:
1. Fonlow.EntityFrameworkCore.Abstract
1. Fonlow.EntityFrameworkCore.MySql
1. Fonlow.EntityFrameworkCore.Sqlite
1. Fonlow.EntityFrameworkCore.MsSql
1. Fonlow.EntityFrameworkCore.PostgreSQL

Therefore, through altering a connection string in the app settings, your app can switch to another DB engine during deployment, along with the plugin assembly and its dependencies.

**Hints:**

* It should be quick and easy for you to write Fonlow.EntityFrameworkCore.MyFavoriteDbEngine for MS SQL or Oracle etc.

##  ASP.NET Core Identity

Provides a few libraries to create a database of ASP.NET Core Identity with a concrete database engine:
1. Fonlow.AspNetCore.Identity
1. Fonlow.AuthDbCreator
1. Fonlow.WebApp.Accounts

Please read the readme.md file of each library.

**Hints:**

* Even if you don't use ASP.NET Core Identity for authentication, but something like Okta, Auth0 or Azure AD / MS Entra ID, doupling main business modules from the authentication implementation is beneficial to CI and business, and having a locally hosted ASP.NET Core Identity implementation makes integration tests fast as explained below.
* Microsoft has provided similar classes out of the box from libraries or scaffolding codes of ASP.NET MVC, however, using string for ID, while these libraries use GUID.



===Article later ===========

Microsoft .NET Framework and .NET Core have provided architectural design for application programmer to decouple the concrete implementation of authentication from the main business logic codes, through a class named AuthorizeAttribute in variety of its development frameworks:
1. [System.WebHttp.AuthorizeAttribute](https://learn.microsoft.com/en-us/previous-versions/aspnet/hh834194(v=vs.118)) of .NET Framework
1. [System.Web.Mvc.AuthorizeAttribute](https://learn.microsoft.com/en-us/dotnet/api/system.web.mvc.authorizeattribute) of .NET Framework
1. ...
1. [Microsoft.AspNetCore.Authorization.AuthorizeAttribute](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.authorizeattribute)

In addition to the architectural design, such naming convention through name "AthorizeAttribute" makes code migrations and switching authentication mechanism even easier.

**Remarks:**

The decoupling in WCF goes through different approach, as described on https://learn.microsoft.com/en-us/dotnet/framework/wcf/feature-details/authentication-in-wcf

