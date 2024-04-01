namespace DemoApp.Accounts
{
    /// <summary>
    /// Roles used in operation contracts and the RoleProvider in ASP .NET
    /// </summary>
    /// <remarks>string constants preferred rather than enum since RoleId is assigned by the DB.</remarks>
    public static class RoleConstants
    {
        /// <summary>
        /// System administrator. Mapped to a predefined role "admin" recorded in table aspnetcore.roles.
        /// </summary>
        public const string Admin = "admin";

		public const string AdminOrManager = Admin + "," + "manager";
	}
}
