using Fonlow.AuthDbCreator;
using Fonlow.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Reflection;
using System.Threading.Tasks;

namespace AuthDbCreator
{
	/// <summary>
	/// Create database AppAuth for development.
	/// When running "AuthDbCreator.exe PluginAssemblyName connectionString", it will create Sqlite database.
	/// Without arguments, this will create a database according to connection string in appsettings.json.
	/// </summary>
	class Program
	{
		static async Task<int> Main(string[] args)
		{
			AuthDb authDb;
			IConfigurationRoot config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
			var appSettings = config.GetSection("appSettings");

			//AppDomain appDomain = AppDomain.CurrentDomain;
			//appDomain.AssemblyResolve += AppDomain_AssemblyResolve;

			if (args.Length == 0)//for internal development
			{
				Console.WriteLine("Create database with connection string in appsetings.json ...");
				var plugins = appSettings.GetSection("dbEngineDbContextPlugins").Get<string[]>();
				if (plugins == null || plugins.Length == 0)
				{
					Console.Error.WriteLine("No plugin of dbEngineDbContext found in appSettings");
					return 10;
				}

				var dbEngineDbContext = DbEngineDbContextLoader.CreateDbEngineDbContextFromAssemblyFile(plugins[0] + ".dll");
				if (dbEngineDbContext == null)
				{
					Console.Error.WriteLine("No dbEngineDbContext");
					return 11;
				}

				authDb = new AuthDb(config, dbEngineDbContext);
				await authDb.DropAndCreate();
			}
			else
			{
				var pluginAssemblyName = args[0];
				var dbEngineDbContext = DbEngineDbContextLoader.CreateDbEngineDbContextFromAssemblyFile(pluginAssemblyName + ".dll");
				if (dbEngineDbContext == null)
				{
					Console.Error.WriteLine("No dbEngineDbContext");
					return 11;
				}

				var connectionString = args[1];
				Console.WriteLine("Create database with arguments ...");
				authDb = new AuthDb(config, connectionString, dbEngineDbContext);
				await authDb.DropAndCreate();
			}

			await authDb.SeedDb();
			Console.WriteLine("Done.");
			return 0;
		}

		static readonly Assembly currentAssembly = Assembly.GetExecutingAssembly();

		//private static System.Reflection.Assembly AppDomain_AssemblyResolve(object sender, ResolveEventArgs args) good for inspecting the cascaded loading of assemblies
		//{
		//	System.Reflection.Assembly assembly;
		//	try
		//	{
		//		if (args.RequestingAssembly == null || args.RequestingAssembly == currentAssembly)
		//			return null;

		//		assembly = System.Reflection.Assembly.Load(args.Name);
		//		Console.WriteLine("Load {0} that {1} depends on.", args.Name, args.RequestingAssembly.FullName);
		//		return assembly;
		//	}
		//	catch (System.IO.FileNotFoundException e)
		//	{
		//		Console.WriteLine(e.ToString());
		//		string dirOfRequestingAssembly = System.IO.Path.GetDirectoryName(args.RequestingAssembly.Location);
		//		string assemblyShortName = args.Name.Substring(0, args.Name.IndexOf(','));
		//		string assemblyFullPath = System.IO.Path.Combine(dirOfRequestingAssembly, assemblyShortName + ".dll");//hopefully nobody would use exe for the dependency.
		//		assembly = System.Reflection.Assembly.LoadFrom(assemblyFullPath);


		//		return assembly;
		//	}
		//	catch (Exception ex)
		//	{
		//		var s = ex.ToString();
		//		Console.Error.WriteLine(s);
		//		throw;
		//	}
		//}

	}

}
