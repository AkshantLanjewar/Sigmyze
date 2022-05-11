using SigmyzeServer.Models.User;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

public interface IUserAuth
{
    
}

public class AuthService : IUserAuth
{
    private readonly IMongoCollection<User> _userCollection;

    public AuthService(IOptions<AuthDatabaseSettings> authDatabaseSettings)
    {
        var mongoClient  = new MongoClient(authDatabaseSettings.Value.ConnectionString);
        var mongoDatabse = mongoClient.GetDatabase(authDatabaseSettings.Value.DatabaseName);
        _userCollection  = mongoDatabse.GetCollection<User>(authDatabaseSettings.Value.AuthCollectionName); 
    }

    
}