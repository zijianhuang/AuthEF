using Microsoft.EntityFrameworkCore;

namespace Fonlow.EntityFrameworkCore.MsSql
{
	public class MsSqlDbEngineDbContext : Fonlow.EntityFrameworkCore.Abstract.IDbEngineDbContext
	{
		public string DbEngineName => "MsSqlServer";

		public void ConnectDatabase(DbContextOptionsBuilder dcob, string connectionString)
		{
			dcob.UseSqlServer(connectionString);
		}
	}
}
