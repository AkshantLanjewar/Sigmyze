using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SigmyzeServer.Models.UserData;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services
{
    public interface IUserDataService
    {
        Task<UserData?> GetAsync(string lunar_id);
        Task CreateAsync(UserData newData);
        Task UpdateAsync(string lunar_id, UserData updatedData);
        Task RemoveAsync(string lunar_id);
    }

    public class UserDataService : IUserDataService
    {
        private readonly IMongoCollection<UserData> _userDataCollection;

        public UserDataService(IOptions<AuthDatabaseSettings> authDatabaseSettings)
        {
            var mongoClient     = new MongoClient(authDatabaseSettings.Value.ConnectionString);
            var mongoDatabase   = mongoClient.GetDatabase(authDatabaseSettings.Value.DatabaseName);
            _userDataCollection = mongoDatabase.GetCollection<UserData>("user_data");
        }

        public async Task<UserData?> GetAsync(string lunar_id) =>
            await _userDataCollection.Find(x => x.Lunar_ID == lunar_id).FirstOrDefaultAsync();

        public async Task CreateAsync(UserData newData) =>
            await _userDataCollection.InsertOneAsync(newData);
        
        public async Task UpdateAsync(string lunar_id, UserData updatedData) =>
            await _userDataCollection.ReplaceOneAsync(x => x.Lunar_ID == lunar_id, updatedData);

        public async Task RemoveAsync(string lunar_id) =>
            await _userDataCollection.DeleteOneAsync(x => x.Lunar_ID == lunar_id);
    }
}