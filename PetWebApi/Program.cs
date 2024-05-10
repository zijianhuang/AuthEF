using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using Fonlow.WebApp.Identity;

System.Reflection.Assembly appAssembly = System.Reflection.Assembly.GetExecutingAssembly();
string dirOfAppAssembly = System.IO.Path.GetDirectoryName(appAssembly.Location);
IConfigurationRoot config = new ConfigurationBuilder().AddJsonFile(System.IO.Path.Combine(dirOfAppAssembly, "appsettings.json")).Build();
var appSettings = config.GetSection("appSettings");
var environment = appSettings.GetValue<string>("environment");

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

string webRootPath = "./";


// WebRootPath is to tell the Web server where to look for files to serve.
// ContentRootPath is to tell the Web service code where to look for data.
// On Windows, ContentRootPath is the starting folder of the app assembly, and on MacOS, it is the user profile folder like //Users/MyName.
// Thus on MacOS, the App_Data folder should be under the user profile folder.
var options = new WebApplicationOptions
{
	WebRootPath = webRootPath,
	Args = args,
};


var builder = WebApplication.CreateBuilder(options);
builder.Configuration.AddConfiguration(config);
Console.WriteLine($"Start at contentRootPath: {builder.Environment.ContentRootPath}; WebRootPath: {builder.Environment.WebRootPath}");

var issuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(authSetupSettings.SymmetricSecurityKeyString));
builder.Services.AddSingleton(issuerSigningKey);

builder.Services.AddSingleton(authSettings);

builder.Services.AddControllers(configure =>
{
	//configure.Filters.Add(new WebApp.Utilities.ValidateModelAttribute());

}).AddNewtonsoftJson(options =>
{
	options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
});

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
	options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
	{
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		ValidAudience = authSettings.Audience,
		ValidIssuer = authSettings.Issuer,
		IssuerSigningKey = issuerSigningKey,
#if DEBUG
		ClockSkew = TimeSpan.FromSeconds(2), //Default is 300 seconds. This is for testing the correctness of the auth protocol implementation between C/S.
#endif
	}; // Thanks to https://dotnetdetail.net/asp-net-core-3-0-web-api-token-based-authentication-example-using-jwt-in-vs2019/
});

builder.Services.AddCors(options => options.AddPolicy("All", builder =>
{
	builder.AllowAnyMethod()
		   .AllowAnyOrigin()
		   .AllowAnyHeader()
		   ;
}));


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
