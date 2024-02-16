using MongoDB.Driver;
using SigmyzeServer.Models.Lunar;
using SigmyzeServer.Services.Web.Lunar;

namespace Test.Lunar;

public class LunarServiceUpdateFileTreeTests()
{
    public LunarDocument[] GenerateLunarDocuments()
    {
        List<LunarDocument> documents = [ LunarDocumentTests.GenerateValidDocuemnt() ];
        return documents.ToArray();
    }

    public SimpleFolder GenerateValidNewFolder()
    {
        SimpleFolder folder = new SimpleFolder
        {
            FolderName = "new-folder",
            FolderId = "test-new-folder",
            Folders = new List<SimpleFolder>(),
            Files = new List<string>()
        };

        return folder;
    }

    [Fact]
    public async Task BaseCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        SimpleFilesystem newFilessytem = LunarDocumentTests.GenerateValidSimpleFilesystem("Swag");
        newFilessytem.Folders![0].Folders!.Add(GenerateValidNewFolder());

        //act
        await service.UpdateFileTree("orgId", "projectSwag", newFilessytem);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        //check that there is a new folder attached with the correct id
        Assert.NotNull(document);
        Assert.Equal("test-new-folder", document.Filesystem!.Folders![0].Folders![0].FolderId);
    }

    [Fact]
    public async Task InvalidNewFilesystemCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        //act
        await service.UpdateFileTree("orgId", "projectSwag", new SimpleFilesystem());

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Empty(document.Filesystem!.Folders![0].Folders!);
    }

    [Fact]
    public async Task InvalidOrganizationIdCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        SimpleFilesystem newFilessytem = LunarDocumentTests.GenerateValidSimpleFilesystem("Swag");
        newFilessytem.Folders![0].Folders!.Add(GenerateValidNewFolder());

        //act
        await service.UpdateFileTree("random", "projectSwag", newFilessytem);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Empty(document.Filesystem!.Folders![0].Folders!);
    }

    [Fact]
    public async Task InvalidProjectIdCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        SimpleFilesystem newFilessytem = LunarDocumentTests.GenerateValidSimpleFilesystem("Swag");
        newFilessytem.Folders![0].Folders!.Add(GenerateValidNewFolder());

        //act
        await service.UpdateFileTree("orgId", "random", newFilessytem);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Empty(document.Filesystem!.Folders![0].Folders!);
    }
}