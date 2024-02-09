namespace SigmyzeServer.Models.User
{
    public class AuthDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string AuthCollectionName { get; set; } = null!;
    }
}