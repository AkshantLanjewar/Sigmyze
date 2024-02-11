using MongoDB.Driver;
using SigmyzeServer.Models.Lunar;
using SigmyzeServer.Services.Web.Lunar;

namespace Test.Lunar;

public class LunarServiceUpdateNameTests
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
        await service.UpdateName("orgId", "projectSwag", "test-title");

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Equal("test-title", document.ProjectName);
        Assert.Equal("test-title", document.Filesystem!.Folders![0].FolderName);
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
        await service.UpdateName("random", "projectSwag", "test-title");

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.NotEqual("test-title", document.ProjectName);
        Assert.NotEqual("test-title", document.Filesystem!.Folders![0].FolderName);
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
        await service.UpdateName("orgId", "random", "test-title");

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.NotEqual("test-title", document.ProjectName);
        Assert.NotEqual("test-title", document.Filesystem!.Folders![0].FolderName);
    }
}