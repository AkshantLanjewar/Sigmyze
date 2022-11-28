using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.Polis;

namespace SigmyzeServer.Services.DatabaseServices
{
    public interface IPolisService
    {
        Task<Polis?> GetPolis(string polisId);
        Task CreatePolis(Polis polis);
    }

    public class PolisORM : IPolisService
    {
        private readonly IMongoCollection<Polis> _collection;

        public PolisORM(IOptions<AuthDatabaseSettings> authDatabaseSettings)
        {
            var mongoClient   = new MongoClient(authDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(authDatabaseSettings.Value.DatabaseName);
            _collection       = mongoDatabase.GetCollection<Polis>("polis");
        }

        public async Task<Polis?> GetPolis(string polisId)
        {
            return await _collection.Find(x => x.PolisId == polisId).FirstOrDefaultAsync();
        }

        public async Task CreatePolis(Polis polis)
        {
            await _collection.InsertOneAsync(polis);
        }
    }
}