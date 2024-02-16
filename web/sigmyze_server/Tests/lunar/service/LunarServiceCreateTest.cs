namespace Test.Lunar;

using SigmyzeServer.Services.Web.Lunar;
using SigmyzeServer.Models.Lunar;
using MongoDB.Driver;
using Xunit.Abstractions;

public class LunarServiceCreateTests
{
    private readonly ITestOutputHelper _output;

    public LunarServiceCreateTests(ITestOutputHelper output)
    {
        _output = output;
    }

    public LunarDocument[] GenerateLunarDocuments()
    {
        List<LunarDocument> documents = [LunarDocumentTests.GenerateValidDocuemnt()];

        return documents.ToArray();
    }

    [Fact]
    public async Task BaseCase()
    {
        //collect
        List<LunarDocument> documents = new List<LunarDocument>();
        ServiceMockedData mocked = new ServiceMockedData(documents.ToArray(), _output);

        //act
        IMongoClient client = mocked.GetClient();
        LunarRefreshService service = new LunarRefreshService(client);
        string? output = await service.CreateProject("randomOid", "randomPid", "projectName");

        //expect
        Assert.Null(output);
        
        //we need to get the document in the collection
        IMongoDatabase db = client.GetDatabase("aplication::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");

        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "randomPid" && x.OrganizationId == "randomOid")
            .FirstOrDefaultAsync();

        //check the match document isnt null, and that the title is projectName
        Assert.NotNull(matchDocument);
        Assert.Equal("projectName", matchDocument.ProjectName);
    }
    
    [Fact]
    public async Task MatchingIdDiffOrgIdCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();
        LunarRefreshService service = new LunarRefreshService(client);

        //act
        string? output = await service.CreateProject("diffOrg", "projectSwag", "Title Name");

        //expect
        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        
        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "projectSwag" && x.OrganizationId == "diffOrg")
            .FirstOrDefaultAsync();

        //check the match document isnt null, and that the title is projectName
        Assert.Null(output);
        Assert.NotNull(matchDocument);
        Assert.Equal("Title Name", matchDocument.ProjectName);
    }

    [Fact]
    public async Task MatchingIdTestCase()
    {
        //collect
        LunarDocument[] documents = GenerateLunarDocuments();
        ServiceMockedData mocked = new ServiceMockedData(documents);

        IMongoClient client = mocked.GetClient();
        LunarRefreshService service = new LunarRefreshService(client);

        //act
        string? output = await service.CreateProject("orgId", "projectSwag", "Title Name");

        //expect
        Assert.NotNull(output);

        //get the document with the new id
        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");

        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == output && x.OrganizationId == "orgId")
            .FirstOrDefaultAsync();

        //check that it isnt null and the title is TItle Name
        Assert.NotNull(matchDocument);
        Assert.Equal("Title Name", matchDocument.ProjectName);
    }
}