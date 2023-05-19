using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services.OrganizationServices;

public interface IQuantaIndicatorRepository
{
    Task<GetIndicatorsQuery?> SelectProjectIndicator(string projectId, List<QuantaQuery> query);
    Task<GetIndicatorsLength?> GetProjectIndicatorsLength(string quantaId);
    Task<GetIndicatorsLength?> SelectProjectIndicatorLength(string projectId, List<QuantaQuery> query);
    Task<GetIndicatorsQuery?> PageSelectedIndicators(string projectId, List<QuantaQuery> query, int page, int pageLen);
    Task<QuantaIndicator?> SelectProjectIndicatorId(string projectId, string indicatorId);
    Task ClearIndicators(string quantaId);
    Task ChunkIndicators(string quantaId, List<QuantaIndicator> indicators);
}

public partial class QuantaIndicatorRepository : IQuantaIndicatorRepository
{
    private readonly IMongoCollection<QuantaIndicatorRepositoryDef> _quantaRepository;
    private readonly IMongoCollection<QuantaIndicatorChunk> _quantaIndicatorChunks;

    public QuantaIndicatorRepository(IOptions<AuthDatabaseSettings> authDatabaseSettings)
    {
        var mongoClient = new MongoClient(authDatabaseSettings.Value.ConnectionString);
        var mongoDatabse = mongoClient.GetDatabase("SigmyzeOrganizations");

        _quantaRepository = mongoDatabse.GetCollection<QuantaIndicatorRepositoryDef>("quanta_indicators");
        _quantaIndicatorChunks = mongoDatabse.GetCollection<QuantaIndicatorChunk>("quanta_chunks");

        //build the index's
        var quantaIdIndex = Builders<QuantaIndicatorRepositoryDef>.IndexKeys.Ascending(x => x.QuantaId);
        _quantaRepository.Indexes.CreateOne(new CreateIndexModel<QuantaIndicatorRepositoryDef>(quantaIdIndex));
    }

    private bool validateQuery(QuantaQuery query)
    {
        if(query.FieldKey == null || query.FieldType == null)
            return false;

        string fieldType = query.FieldType;
        if(fieldType == "string" && query.StringField == null)
            return false;
        if(fieldType == "date" && query.DateField == null)
            return false;

        return true;
    }

    private bool validateOptionalQuery(QuantaQuery query)
    {
        if(query.FieldKey == null || query.FieldType == null)
            return false;

        string fieldType = query.FieldType;
        if(fieldType == "string" && query.StringFields == null)
            return false;
        if(fieldType == "date" && query.DateFields == null)
            return false;

        return true;
    }

    public async Task ClearIndicators(string quantaId)
    {
        var filter = Builders<QuantaIndicatorRepositoryDef>.Filter
            .Eq(x => x.QuantaId, quantaId);
        var update = Builders<QuantaIndicatorRepositoryDef>.Update
            .Set(x => x.ProjectIndicators, new List<QuantaIndicator>());

        await _quantaRepository.UpdateOneAsync(filter, update);
    }
}