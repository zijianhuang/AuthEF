using Fonlow.AspNetCore.Identity;
using Fonlow.AspNetCore.Identity.EntityFrameworkCore;
using Fonlow.DateOnlyExtensions;
using Fonlow.EntityFrameworkCore;
using Fonlow.WebApp.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using WebApp.Utilities;

#region Security config
System.Reflection.Assembly appAssembly = System.Reflection.Assembly.GetExecutingAssembly();
string dirOfAppAssembly = System.IO.Path.GetDirectoryName(appAssembly.Location);
IConfigurationRoot config = new ConfigurationBuilder().AddJsonFile(System.IO.Path.Combine(dirOfAppAssembly, "appsettings.json")).Build();
var appSettings = config.GetSection("appSettings");
var environment = appSettings.GetValue<string>("environment");
var dbEngineDbContextPlugins = appSettings.GetSection("dbEngineDbContextPlugins").Get<string[]>();
var identityConnectionString = config.GetConnectionString("IdentityConnection");
IAuthSetupSecrets authSetupSettings = null;
IAuthSettings authSettings = null;

if (environment == "test")
{
	var authSetupSettingsSection = config.GetSection("AuthSetupSettings");
	var authSetupSettingsObject = new AuthSetupSettings();
	authSetupSettingsSection.Bind(authSetupSettingsObject);
	authSetupSettings = authSetupSettingsObject;
	authSettings = authSetupSettingsObject;
}
else
{
	// fill authSetupSettings with data from a secured storage
}

if (authSetupSettings == null || string.IsNullOrEmpty(authSetupSettings.SymmetricSecurityKeyString))
{
	throw new ArgumentException("Need SymmetricSecurityKeyString"); // or throw whatever app specific exception
}

#endregion

#region Common Web API setup
string webRootPath = "./";
string dataDirectory = "./DemoApp_Data";


// WebRootPath is to tell the Web server where to look for files to serve.
// ContentRootPath is to tell the Web service code where to look for data.
// On Windows, ContentRootPath is the starting folder of the app assembly, and on MacOS, it is the user profile folder like //Users/MyName.
// Thus on MacOS, the App_Data folder should be under the user profile folder.
var options = new WebApplicationOptions
{
	WebRootPath = webRootPath,
	Args = args,
};

WebApplicationBuilder builder = WebApplication.CreateBuilder(options);
builder.Configuration.AddConfiguration(config);
Console.WriteLine($"Start at contentRootPath: {builder.Environment.ContentRootPath}; WebRootPath: {builder.Environment.WebRootPath}; Current: {Directory.GetCurrentDirectory()}");


builder.Services.AddControllers(configure =>
{
#if DEBUG
	configure.Conventions.Add(new Fonlow.CodeDom.Web.ApiExplorerVisibilityEnabledConvention());//To make ApiExplorer be visible to WebApiClientGen	
#endif
	configure.ModelBinderProviders.Insert(0, new OAuth2RequestBinderProvider());
})
.AddJsonOptions(// as of .NET 7/8, could not handle JS/CS test cases getInt2D, postInt2D and PostDictionaryOfPeople, around 14 C# test cases fail.
options =>
{


});

builder.Services.AddCors(options => options.AddPolicy("All", builder =>
{
	builder.AllowAnyMethod()
		   .AllowAnyOrigin()
		   .AllowAnyHeader()
		   ;
}));

#endregion

#region EF DbContext setup without coupling with any SQL Db engin
var identityDbEngineDbContext = DbEngineDbContextLoader.CreateDbEngineDbContextFromAssemblyFile(dbEngineDbContextPlugins[0] + ".dll");
if (identityDbEngineDbContext == null)
{
	Console.Error.WriteLine("No dbEngineDbContext");
	throw new ArgumentException("Need dbEngineDbContextPlugin");
}

Console.WriteLine($"DB Engine: {identityDbEngineDbContext.DbEngineName}");

#endregion

#region Auth setup
var issuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(authSetupSettings.SymmetricSecurityKeyString));
var tokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
{
	ValidateIssuer = true,
	ValidateAudience = true,
	ValidateLifetime = true,
	ValidateIssuerSigningKey = true,
	ValidAudience = authSettings.Audience,
	ValidIssuer = authSettings.Issuer,
	IssuerSigningKey = issuerSigningKey,
	ClockSkew = TimeSpan.FromSeconds(authSettings.ClockSkewSeconds), //Default is 300 seconds. This is for testing the correctness of the auth protocol implementation between C/S.
};

var tokenValidationParametersNoValidateLifetime = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
{
	ValidateIssuer = true,
	ValidateAudience = true,
	ValidateLifetime = false, // for refresh token and signed out
	ValidateIssuerSigningKey = true,
	ValidAudience = authSettings.Audience,
	ValidIssuer = authSettings.Issuer,
	IssuerSigningKey = issuerSigningKey,
	ClockSkew = TimeSpan.FromSeconds(authSettings.ClockSkewSeconds),
};

builder.Services.AddKeyedSingleton("NotValidateLifetime", tokenValidationParametersNoValidateLifetime);
builder.Services.AddSingleton(authSettings);

builder.Services.AddAuthentication(
	options =>
	{
		options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; //Bearer
		options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
		options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
	}
).AddJwtBearer(options =>
{
	options.SaveToken = true;
	options.RequireHttpsMetadata = false;
	options.TokenValidationParameters = tokenValidationParameters;
});

builder.Services.AddDbContext<ApplicationDbContext>(dcob =>
{
	identityDbEngineDbContext.ConnectDatabase(dcob, identityConnectionString); // called by runtime everytime an instance of ApplicationDbContext is created.
});

builder.Services.AddIdentity<ApplicationUser, ApplicationIdentityRole>(
					options =>
					{
						options.ClaimsIdentity.UserNameClaimType = "UserID";
					}
				)
				.AddEntityFrameworkStores<ApplicationDbContext>()
				.AddUserManager<ApplicationUserManager>()
				.AddDefaultTokenProviders()
				.AddTokenProvider(authSettings.TokenProviderName, typeof(DataProtectorTokenProvider<ApplicationUser>)); //thanks to https://stackoverflow.com/questions/53659247/using-aspnetusertokens-table-to-store-refresh-token-in-asp-net-core-web-api;
#endregion

var app = builder.Build();

if (app.Environment.IsDevelopment()) //ASPNETCORE_ENVIRONMENT=Development in web.config
{
	app.UseDeveloperExceptionPage();
}
else
{
	//	//Only release build support https redirection.
	//#if RELEASE
	//	if (useHttps) // for locally running app, no need to have https.
	//	{
	//		app.UseHttpsRedirection();
	//		app.UseHsts();//https://learn.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-6.0
	//	}
	//#endif
}
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("All");

app.MapControllers();

if (args.Length > 1)
{
	app.Urls.Add(builder.Environment.WebRootPath);
}

app.UseStaticFiles(); //This may cause IIS rewrite rule to fail during login. So, not to use IIS Rewrite rule.
					  //and using rewrit in middleware is not worthy, https://learn.microsoft.com/en-us/aspnet/core/fundamentals/url-rewriting?view=aspnetcore-6.0

app.Run();
Console.WriteLine("Run Done.");
