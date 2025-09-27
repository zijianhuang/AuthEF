This project is based on [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity).

## Overview

This repository serves multiple purposes:
1. Demonstrate "[Decouple ASP.NET Core Identity, Authentication and Database Engines](https://www.codeproject.com/Articles/5378824/Decouple-ASP-NET-Core-Identity-Authentication-and)" / [Local Copy](Docs/Articles/Article1/Decouple%20ASP.NET%20Core%20Identity,%20Authentication%20and%20Database%20Engines.md)
2. Demonstrate "[Share Identity Bear Tokens among ASP.NET Core Web APIs](https://www.codeproject.com/Articles/5382165/Share-Identity-Bear-Tokens-among-ASP-NET-Core-Web)" / [Local Copy](Docs/Articles/CodeProject/Share%20Identity%20Bearer%20Tokens%20among%20ASP.NET%20Core%20Web%20APIs%20-%20CodeProject.html)
3. Demonstrate "[Resource Owner Password Credentials Grant and Refreshing Token with ASP.NET Core Identity](https://www.codeproject.com/Articles/5385175/ROPC-and-Refresh-Token-with-ASP-NET-Core-Identity)" / [Local Copy](Docs/Articles/CodeProject/ROPC%20and%20Refresh%20Token%20with%20ASP.NET%20Core%20Identity%20-%20CodeProject.html)
4. Provide some plugin components that decouple business modules from concrete SQL database engines.
5. Provide some components that decouple ASP.NET Core Identity with concrete database engines.
6. Demonstrate how to craft integration tests and run on local dev PC as much as possible, and the artifacts could be easily reused in a team CI server like GitHub Actions/Workflow.

In a nutshell:
1. "AuthController" provides "Resource Owner Password Credentials Grant" of OAuth 2.0 but without client_id and PKCE involved, for SPA and desktop apps.
1. "AccountController" provides basic user account APIs.
1. With "connectionId", one user can have multiple logins on multiple devices concurrently.

Remarks:
* What demonstrated with ROPC may not be hacker proof when being used in SPA.

References:

* [How to use Identity to secure a Web API backend for SPAs](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization), along with [the recommendation](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization#use-token-based-authentication) about token vs cookie.
* [Scaffold Identity in ASP.NET Core projects](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/scaffold-identity) for Blazor and MVC.


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

## Better Solutions

The solution offered in this project is offering what slightly better than very old username+password only authentication, and slightly worse thant ROPC of oAuth 2.0 because client id and PKCE is are not utilized, while ROPC is generally not recommended for SPA.

For more secure .NET solutions free and open sourced:

* [Identity Server 8](https://github.com/alexhiggins732/IdentityServer8)
* [OpenIddict](https://github.com/openiddict/openiddict-core)


===Article later ===========

Microsoft .NET Framework and .NET Core have provided architectural design for application programmer to decouple the concrete implementation of authentication from the main business logic codes, through a class named AuthorizeAttribute in variety of its development frameworks:
1. [System.WebHttp.AuthorizeAttribute](https://learn.microsoft.com/en-us/previous-versions/aspnet/hh834194(v=vs.118)) of .NET Framework
1. [System.Web.Mvc.AuthorizeAttribute](https://learn.microsoft.com/en-us/dotnet/api/system.web.mvc.authorizeattribute) of .NET Framework
1. ...
1. [Microsoft.AspNetCore.Authorization.AuthorizeAttribute](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.authorization.authorizeattribute)

In addition to the architectural design, such naming convention through name "AthorizeAttribute" makes code migrations and switching authentication mechanism even easier.

**Remarks:**

The decoupling in WCF goes through different approach, as described on https://learn.microsoft.com/en-us/dotnet/framework/wcf/feature-details/authentication-in-wcf

