## Decoupling Entity Framework and DB Engines

Provides a few libraries to decouple business modules from concrete SQL database engines:
1. Fonlow.EntityFrameworkCore.Abstract
1. Fonlow.EntityFrameworkCore.MySql
1. Fonlow.EntityFrameworkCore.Sqlite

Therefore, through altering a connection string in the app settings, your app can switch to another DB engine during deployment.

**Hints:**

* It shoudl be quick and easy for you to write Fonlow.EntityFrameworkCore.MyFavoriteDbEngine for MS SQL or Oracle etc.

##  ASP.NET Core Identity

Provides a few libraries to create a database of ASP.NET Core Identity with a concreate database engine:
1. Fonlow.AspNetCore.Identity
1. Fonlow.AuthDbCreator
1. Fonlow.WebApp.Accounts

Please read the readme.md file of each library.

**Hints:**

* Even if you don't use ASP.NET Core Identity for authentication, but something like Okta, Auth0 or Azure AD / MS Entra ID, doupling main business modules from the authentication implementation is benefitical to CI and business, and having a locally hosted ASP.NET Core Identity implementation makes integration tests fast as explained below.
* Microsoft has provided similar classes out of the box from libraries or scarfolding codes of ASP.NET MVC, however, using string for ID, while these libraries use GUID.



===Article later ===========

Microsoft .NET Framework and .NET Core have provided architectural design for application programmer to decouple the concrete implementation of authentication from the main business logic codes, through a class named AuthorizeAttribute in variety of its development frameworks:
1. [System.WebHttp.AuthorizeAttribute](https://learn.microsoft.com/en-us/previous-versions/aspnet/hh834194(v=vs.118)) of .NET Framework
1. [System.Web.Mvc.AuthorizeAttribute](https://learn.microsoft.com/en-us/dotnet/api/system.web.mvc.authorizeattribute) of .NET Framework
1. ...
1. [Microsoft.AspNetCore.Authorization.AuthorizeAttribute](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.authorizeattribute)

In addition to the architectural design, such naming convention through name "AthorizeAttribute" makes code migrations and switching authentication mechanism even easier.

**Remarks:**

The decoupling in WCF goes through different approach, as described on https://learn.microsoft.com/en-us/dotnet/framework/wcf/feature-details/authentication-in-wcf

