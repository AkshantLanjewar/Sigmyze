using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services.DatabaseServices;

public interface IQuantaExecutionService
{
    Task<string> UploadBody(List<QuantaInternalStoreWrapper> preloadedData);
    Task<List<QuantaInternalStoreWrapper>?> GetBody(string token);
    Task DeleteUpload(string token);
}

public class QuantaExecutionService : IQuantaExecutionService
{
    private readonly IMongoCollection<UploadStoreSchema> _uploadCollection;
    public QuantaExecutionService(IOptions<AuthDatabaseSettings> authDatabaseSettings)
    {
        var mongoClient = new MongoClient(authDatabaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase("SigmyzeData");

        _uploadCollection = mongoDatabase.GetCollection<UploadStoreSchema>("execution_upload");
    }

    public async Task<string> UploadBody(List<QuantaInternalStoreWrapper> preloadedData)
    {
        UploadStoreSchema schema = new UploadStoreSchema();
        string token = Guid.NewGuid().ToString();
        string preloadString = JsonConvert.SerializeObject(preloadedData);

        List<string> chunks = (from Match m in Regex.Matches(preloadString, @"\d{10000000}")
                            select m.Value).ToList();

        List<UploadStoreSchema> uploadChunks = new List<UploadStoreSchema>();
        for(int i = 0; i < chunks.Count; i++)
        {
            UploadStoreSchema chunkObject = new UploadStoreSchema();
            chunkObject.Token = token;
            chunkObject.Chunk = chunks[i];

            uploadChunks.Add(chunkObject);
        }
        
        await _uploadCollection.InsertManyAsync(uploadChunks);
        return token;
    }

    public async Task<List<QuantaInternalStoreWrapper>?> GetBody(string token)
    {   
        BsonDocument matchStage = new BsonDocument {
            {
                "$match", new BsonDocument {
                    { "token", token }
                }
            }
        };

        BsonDocument projectStage = new BsonDocument {
            {
                "$project", new BsonDocument {
                    { "chunk", "$chunk" }
                }
            }
        };

        BsonDocument[] pipeline = new BsonDocument[]
        {
            matchStage,
            projectStage
        };

        List<GetUploadChunkData> results = await _uploadCollection
            .Aggregate<GetUploadChunkData>(pipeline).ToListAsync();

        string connectedOutput = "";
        for(int i = 0; i < results.Count; i++)
        {
            GetUploadChunkData result = results[i];
            if(result.Chunk == null)
                continue;

            connectedOutput += result.Chunk;
        }

        List<QuantaInternalStoreWrapper>? preloadedData = JsonConvert
            .DeserializeObject<List<QuantaInternalStoreWrapper>>(connectedOutput);

        return preloadedData;
    }

    public async Task DeleteUpload(string token) =>
        await _uploadCollection.DeleteManyAsync(x => x.Token == token);
}