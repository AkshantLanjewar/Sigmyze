using MongoDB.Driver;
using SigmyzeServer.Models.Lunar;
using SigmyzeServer.Services.Web.Lunar;

namespace Test.Lunar;

public class LunarServiceUpdateNoteTests
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
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        List<LunarNote> newNotes = LunarDocumentTests.GenerateLunarNotes();
        newNotes[0].Blocks!.Add(new NoteBlock {
            IsGroup = false,
            BlockType = "paragraph",
            BlockId = "test-new-block",
            BlockContent = "swaggg"
        });

        //act
        await service.UpdateNote("orgId", "projectSwag", newNotes);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Equal(2, document.Notes![0].Blocks!.Count);
    } 

    [Fact]
    public async Task InvalidChartCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        List<LunarNote> newNotes = LunarDocumentTests.GenerateLunarNotes();
        newNotes.Add(new LunarNote());

        //act
        await service.UpdateNote("orgId", "projectSwag", newNotes);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Single(document.Notes!);
    }

    [Fact]
    public async Task WrongOrganizationIdCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        List<LunarNote> newNotes = LunarDocumentTests.GenerateLunarNotes();
        newNotes[0].Blocks!.Add(new NoteBlock {
            IsGroup = false,
            BlockType = "paragraph",
            BlockId = "test-new-block",
            BlockContent = "swaggg"
        });

        //act
        await service.UpdateNote("random", "projectSwag", newNotes);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Single(document.Notes![0].Blocks!);
    }

    [Fact]
    public async Task WrongProjectIdCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        List<LunarNote> newNotes = LunarDocumentTests.GenerateLunarNotes();
        newNotes[0].Blocks!.Add(new NoteBlock {
            IsGroup = false,
            BlockType = "paragraph",
            BlockId = "test-new-block",
            BlockContent = "swaggg"
        });

        //act
        await service.UpdateNote("orgId", "random", newNotes);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Single(document.Notes![0].Blocks!);
    }
}