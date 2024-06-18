using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;

namespace Fonlow.EntityFrameworkCore.PostgreSQL
{
	public class PostgreSqlDbEngineDbContext : Fonlow.EntityFrameworkCore.Abstract.IDbEngineDbContext
	{
		public string DbEngineName => "PostgreSQL";

		public void ConnectDatabase(DbContextOptionsBuilder dcob, string connectionString)
		{
			dcob.UseNpgsql(connectionString);
		}
	}
}
