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

    }
}