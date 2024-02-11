using MongoDB.Driver;
using SigmyzeServer.Models.Lunar;
using SigmyzeServer.Services.Web.Lunar;

namespace Test.Lunar;

public class LunarServiceFetchTests
{
    public LunarDocument[] GenerateLunarDocuments()
    {
        List<LunarDocument> documents = [ LunarDocumentTests.GenerateValidDocuemnt() ];
        return documents.ToArray();
    }

    [Fact]
    public async Task BaseCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        //act
        LunarProjectData? result = await service.GetProjectData("orgId", "projectSwag");

        //expect
        Assert.NotNull(result);
        Assert.True(result.Validate());

        //we need to check that there is still one document within the collection
        int count = (await collection.Find(_ => true).ToListAsync()).Count;
        Assert.Equal(1, count);
    }

    [Fact]
    public async Task WrongProjectIdCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        //act
        LunarProjectData? result = await service.GetProjectData("orgId", "random");

        //expect
        Assert.Null(result);

        //we need to check that there is still one document within the collection
        int count = (await collection.Find(_ => true).ToListAsync()).Count;
        Assert.Equal(1, count);
    }

    [Fact]
    public async Task WrongOrganizationIdCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        //act
        LunarProjectData? result = await service.GetProjectData("swag", "projectSwag");

        //expect
        Assert.Null(result);

        //we need to check that there is still one document within the collection
        int count = (await collection.Find(_ => true).ToListAsync()).Count;
        Assert.Equal(1, count);
    }

    [Fact]
    public async Task InvalidDocumentCase()
    {
        //collect
        LunarDocument[] documents = GenerateLunarDocuments();
        documents[0].Charts![0].ObjectId = "invalid-id";

        ServiceMockedData mocked = new ServiceMockedData(documents);
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        //act
        LunarProjectData? result = await service.GetProjectData("orgId", "projectSwag");

        //expect
        Assert.Null(result);

        //we need to check that there is still one document within the collection
        int count = (await collection.Find(_ => true).ToListAsync()).Count;
        Assert.Equal(1, count);
    }
}