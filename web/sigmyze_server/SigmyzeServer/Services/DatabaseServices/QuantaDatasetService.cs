using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services.DatabaseServices
{
    public interface IQuantaDatasetService
    {
        Task<string> CreateQuantaMapping(string quantaId);
        Task<string?> GetQuantaId(string token);
        Task DeleteMapping(string token);
        Task<bool> QuantaIdExists(string quantaId);
        Task<string?> GetToken(string quantaId);
    }

    public partial class QuantaDatasetService : IQuantaDatasetService
    {
        private readonly IMongoCollection<DatasetMap> _mappingsCollection;

        public QuantaDatasetService(IOptions<AuthDatabaseSettings> authDatabaseSettings)
        {
            var mongoClient = new MongoClient(authDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase("SigmyzeData");

            _mappingsCollection = mongoDatabase.GetCollection<DatasetMap>("mappings");
        }

        public async Task<string> CreateQuantaMapping(string quantaId)
        {
            string token = Guid.NewGuid().ToString();
            DatasetMap map = new DatasetMap();
            map.QuantaId = quantaId;
            map.Token = token;

            await _mappingsCollection.InsertOneAsync(map);
            return map.Token;
        }

        public async Task<string?> GetQuantaId(string token)
        {
            DatasetMap? map = await _mappingsCollection.Find(x => x.Token == token).FirstOrDefaultAsync();
            if(map == null)
                return null;

            return map.QuantaId;
        }

        public async Task<string?> GetToken(string quantaId)
        {
            DatasetMap? map = await _mappingsCollection.Find(x => x.QuantaId == quantaId).FirstOrDefaultAsync();
            return map?.Token;
        }

        public async Task<bool> QuantaIdExists(string quantaId)
        {
            DatasetMap? map = await _mappingsCollection.Find(x => x.QuantaId == quantaId).FirstOrDefaultAsync();
            return map != null;
        }

        public async Task DeleteMapping(string token)
        {
            await _mappingsCollection.DeleteOneAsync(x => x.Token == token);
        }
    }
}