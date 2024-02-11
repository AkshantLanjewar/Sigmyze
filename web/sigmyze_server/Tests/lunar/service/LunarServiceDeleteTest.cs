namespace Test.Lunar;
using SigmyzeServer.Services.Web.Lunar;
using SigmyzeServer.Models.Lunar;
using MongoDB.Driver;

public class LunarServiceDeleteTests
{
    public LunarDocument[] GenerateLunarDocuments()
    {
        List<LunarDocument> documents = [ LunarDocumentTests.GenerateValidDocuemnt() ];
        return documents.ToArray();
    }

    /*
     * This is the base case where the DeleteProject service function correctly deletes a document from the collection 
     */
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
        await service.DeleteProject("orgId", "projectSwag");

        //expect
        int collectionDocuments = (await collection.Find(_ => true).ToListAsync()).Count;
        Assert.Equal(0, collectionDocuments);
    }

    /*
     * This test handles the case when the DeleteProject service function is called but the organization Id does not match
     */
    [Fact]
    public async Task OrganizationIdNoMatchCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        //act
        await service.DeleteProject("random", "projectSwag");

        //expect
        int collectionDocuments = (await collection.Find(_ => true).ToListAsync()).Count;
        Assert.Equal(1, collectionDocuments);
    }

    /*
     * This is the case when the DeleteProject service function is called but the projectId does not match 
     */
    [Fact]
    public async Task ProjectIdNoMatchCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        //act
        await service.DeleteProject("orgId", "swag");

        //expect
        int collectionDocuments = (await collection.Find(_ => true).ToListAsync()).Count;
        Assert.Equal(1, collectionDocuments);
    }
}