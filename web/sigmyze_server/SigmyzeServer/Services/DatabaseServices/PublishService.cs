using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Data;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services.DatabaseServices;

public interface IPublishService
{
    Task<PublishedDatasetCollection?> FetchPublishedDatasetQ(string quantaId);
    Task<PublishedDatasetCollection?> FetchPublishedDataset(string publicId);
    Task CreateOrganizationMapping(string organizationId);
    Task<bool> InOrganizationMapping(string organizationId, string datasetId);
    Task AppendOrganizationMapping(string organizationId, string datasetId);
    Task ReduceOrganizationMapping(string organizationId, string datasetId);
    Task<string> PublishDataset(PublishDatasetPOST data);
    Task<string> UnpublishDataset(UnpublishDatasetPOST data);
    Task<List<QuantaDatasetDisplay>?> GetDatasetCards(string organizationId);
}

public class PublishService : IPublishService
{
    private readonly IMongoCollection<PublishedDatasetCollection> _publishedDatasetsCollection;
    private readonly IMongoCollection<OrganizationPublishedCollection> _organizationIndexCollection;

    public PublishService(IOptions<AuthDatabaseSettings> authDatabaseSettings)
    {
        var mongoClient   = new MongoClient(authDatabaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase("Published");

        _publishedDatasetsCollection = mongoDatabase.GetCollection<PublishedDatasetCollection>("datasets");
        _organizationIndexCollection = mongoDatabase.GetCollection<OrganizationPublishedCollection>("organizationIndex");
    }

    //helper method to check if an organization mapping exists
    private async Task<bool> MappingExists(string organizationId)
    {
        OrganizationPublishedCollection? test = await _organizationIndexCollection.Find(x => x.OrganizationId == organizationId)
            .FirstOrDefaultAsync();

        return test != null;
    }

    private async Task<bool> DatasetExists(string quantaId)
    {
        PublishedDatasetCollection? document = await _publishedDatasetsCollection.Find(x => x.QuantaId == quantaId)
            .FirstOrDefaultAsync();

        return document != null;
    }

    private async Task<OrganizationPublishedCollection?> FetchMapping(string organizationId) =>
        await _organizationIndexCollection.Find(x => x.OrganizationId == organizationId).FirstOrDefaultAsync();
    
    public async Task<PublishedDatasetCollection?> FetchPublishedDatasetQ(string quantaId) =>
        await _publishedDatasetsCollection.Find(x => x.QuantaId == quantaId).FirstOrDefaultAsync();

    public async Task<PublishedDatasetCollection?> FetchPublishedDataset(string publicId) =>
        await _publishedDatasetsCollection.Find(x => x.PublicId == publicId).FirstOrDefaultAsync();

    public async Task CreateOrganizationMapping(string organizationId)
    {
        if(await MappingExists(organizationId) == true)
            return;

        OrganizationPublishedCollection document = new OrganizationPublishedCollection();
        document.OrganizationId = organizationId;
        document.PublishedDatasets = new List<string>();
        await _organizationIndexCollection.InsertOneAsync(document);
    }

    public async Task<bool> InOrganizationMapping(string organizationId, string datasetId)
    {
        if(await MappingExists(organizationId) == false)
        {
            await CreateOrganizationMapping(organizationId);
            return false;
        }

        OrganizationPublishedCollection document = (await FetchMapping(organizationId))!;
        if(document.Verify() == false)
            return false;

        return document.PublishedDatasets!.Contains(datasetId);
    }

    public async Task AppendOrganizationMapping(string organizationId, string datasetId)
    {
        if(await InOrganizationMapping(organizationId, datasetId) == true)
            return;

        //update the mongo document with the new id
        var filter = Builders<OrganizationPublishedCollection>
            .Filter.Eq(e => e.OrganizationId, organizationId);

        var update = Builders<OrganizationPublishedCollection>
            .Update.Push(e => e.PublishedDatasets, datasetId);

        await _organizationIndexCollection.FindOneAndUpdateAsync(filter, update);
    }

    public async Task ReduceOrganizationMapping(string organizationId, string datasetId)
    {
        if(await InOrganizationMapping(organizationId, datasetId) == false)
            return;

        var filter = Builders<OrganizationPublishedCollection>
            .Filter.Eq(e => e.OrganizationId, organizationId);

        var update = Builders<OrganizationPublishedCollection>
            .Update.PullFilter(p => p.PublishedDatasets, datasetId);

        await _organizationIndexCollection.FindOneAndUpdateAsync(filter, update);
    }

    public async Task<List<QuantaDatasetDisplay>?> GetDatasetCards(string organizationId)
    {
        OrganizationPublishedCollection? document = await FetchMapping(organizationId);
        List<string>? publishedDatasets = document?.PublishedDatasets;
        if(publishedDatasets == null)
            return null;

        List<QuantaDatasetDisplay> datasetCards = new List<QuantaDatasetDisplay>();
        for(int i = 0; i < publishedDatasets.Count; i++)
        {
            string publicDatasetId = publishedDatasets[i];
            PublishedDatasetCollection? publishedDocument = await FetchPublishedDataset(publicDatasetId);
            if(publishedDocument == null || publishedDocument.validateCard() == false)
                continue;

            QuantaDatasetDisplay newCard = new QuantaDatasetDisplay();
            newCard.DatasetId = publishedDocument.PublicId;
            newCard.DatasetName = publishedDocument.Title;
            newCard.Description = publishedDocument.Description;
            datasetCards.Add(newCard);
        }

        return datasetCards;
    }

    //helper method for PublishDataset that generates a new id::hash combo until a valid id is found
    private async Task<string> GenerateHash(string organizationId, string datasetId)
    {
        string genHash = generateHash();
        string outputId = datasetId + "::" + genHash;
        if(await InOrganizationMapping(organizationId, outputId) == true)
            outputId = await GenerateHash(organizationId, datasetId);

        return outputId;
    }

    public async Task<string> PublishDataset(PublishDatasetPOST data)
    {
        if(data.Verify() == false)
            return "verify";
        if(await DatasetExists(data.QuantaId!) == true)
            return "dataset";

        string organizationId = data.OrganizationId!;
        if(data.Public == true && data.PublicToken == null)
            return "no_token";
        if(data.PublicToken != "gobbly_goo_this_is_the_token")
            return "invalid_token";
        if(data.Public == true)
            organizationId = "public";

        string publicId = await GenerateHash(organizationId, data.DatasetId!);
        //create the document that needs to be published
        PublishedDatasetCollection document = new PublishedDatasetCollection();
        document.PublicId = publicId;
        document.QuantaId = data.QuantaId;
        document.Description = data.Description;
        document.Title = data.Title;
        document.Public = data.Public;

        await _publishedDatasetsCollection.InsertOneAsync(document);
        await AppendOrganizationMapping(organizationId, publicId);
        return "success";
    }

    public async Task<string> UnpublishDataset(UnpublishDatasetPOST data)
    {
        if(data.Verify() == false)
            return "verify";

        PublishedDatasetCollection? document = await FetchPublishedDatasetQ(data.QuantaId!);
        if(document == null)
            return "no_document";

        string organizationId = data.OrganizationId!;
        if(document.Public == true)
            organizationId = "public";

        string publicId = document.PublicId!;
        await _publishedDatasetsCollection.DeleteOneAsync(x => x.PublicId == publicId);
        await ReduceOrganizationMapping(organizationId, publicId);
        return "success";
    }

    //private util in order to generate the random 4 letter hash for the dataset_id
    private string generateHash() 
    {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var stringChars = new char[4];
        var random = new Random();

        for(int i = 0; i < stringChars.Length; i++)
            stringChars[i] = chars[random.Next(chars.Length)];

        return new String(stringChars);
    }
}