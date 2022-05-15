using SigmyzeServer.Models.User;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace SigmyzeServer.Services.Auth
{
    public interface IUserAuth
    {
        Task<List<User>> GetAsync();
        Task<User?> GetAsync(string lunar_id);
        Task<User?> GetAsyncEmail(string email);
        Task<User?> GetAsyncToken(string token);
        Task CreateAsync(User newUser);
        Task UpdateAsync(string lunar_id, User updatedUser);
        Task UpdateAsyncToken(string token, User updatedUser);
        Task RemoveAsync(string lunar_id);
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

        public async Task<List<User>> GetAsync() =>
            await _userCollection.Find(_ => true).ToListAsync();
        public async Task<User?> GetAsync(string lunar_id) =>
            await _userCollection.Find(x => x.Lunar_ID == lunar_id).FirstOrDefaultAsync();
        public async Task<User?> GetAsyncEmail(string email) =>
            await _userCollection.Find(x => x.EMail == email).FirstOrDefaultAsync();
        public async Task<User?> GetAsyncToken(string token) =>
            await _userCollection.Find(x => x.RefreshToken.Token == token).FirstOrDefaultAsync();
        public async Task CreateAsync(User newUser) =>
            await _userCollection.InsertOneAsync(newUser);
        public async Task UpdateAsync(string lunar_id, User updatedUser) =>
            await _userCollection.ReplaceOneAsync(x => x.Lunar_ID == lunar_id, updatedUser);
        public async Task UpdateAsyncToken(string token, User updatedUser) =>
            await _userCollection.ReplaceOneAsync(x => x.RefreshToken.Token == token, updatedUser);
        public async Task RemoveAsync(string lunar_id) =>
            await _userCollection.DeleteOneAsync(x => x.Lunar_ID == lunar_id);
    }
}