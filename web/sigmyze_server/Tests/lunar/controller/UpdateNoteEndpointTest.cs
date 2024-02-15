using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using SigmyzeServer.Controllers;
using SigmyzeServer.Controllers.Lunar;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.Lunar;
using SigmyzeServer.Services.OrganizationServices;
using SigmyzeServer.Services.Web.Lunar;

namespace Test.Lunar;

public class UpdateNoteEndpointTests
{
    //function to generate a valid service index
    public UserServiceIndex GenerateUserIndex()
    {
        UserServiceIndex index = new UserServiceIndex
        {
            UserId = "test-lunar-id",
            LinkedOrganizations = new List<LinkedOrganization>()
        };

        index.LinkedOrganizations.Add(new LinkedOrganization{
            OrganizationId = "orgId",
            OrganizationName = "Test Organization"
        });

        return index;
    }

    public LunarDocument[] GenerateLunarDocuments()
    {
        List<LunarDocument> documents = [ LunarDocumentTests.GenerateValidDocuemnt() ];
        return documents.ToArray();
    }

    public List<LunarNote> GenerateNewNotes()
    {
        List<LunarNote> notes = LunarDocumentTests.GenerateLunarNotes();
        notes[0].Blocks!.Add(new NoteBlock{
            BlockId = "new-block-id",
            BlockType = "paragraph",
            IsGroup = false,
            BlockContent = ""
        });

        return notes;
    }

    [Fact]
    public async Task BaseCase()
    {
        //collect
        LinkedUserServiceMocked userMocked = new LinkedUserServiceMocked([ GenerateUserIndex() ]);
        UserServiceRepository userService = new UserServiceRepository(userMocked.GetClient());

        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        UpdateLunarNotesBody updateBody = new UpdateLunarNotesBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            NewNotes = GenerateNewNotes()
        };

        //act
        ContentResult? response = await controller.UpdateLunarNote(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Error, "There should be no error the file should be updated");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Equal(2, matchCase.Notes![0].Blocks!.Count);
    }

    [Fact]
    public async Task BadLunarIdCase()
    {
        //collect
        LinkedUserServiceMocked userMocked = new LinkedUserServiceMocked([ GenerateUserIndex() ]);
        UserServiceRepository userService = new UserServiceRepository(userMocked.GetClient());

        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        UpdateLunarNotesBody updateBody = new UpdateLunarNotesBody 
        {
            LunarId = "lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            NewNotes = GenerateNewNotes()
        };

        //act
        ContentResult? response = await controller.UpdateLunarNote(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "There should be an error the lunar id is wrong");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Single(matchCase.Notes![0].Blocks!);
    }

    [Fact]
    public async Task BadOrganizationIdCase()
    {
        //collect
        LinkedUserServiceMocked userMocked = new LinkedUserServiceMocked([ GenerateUserIndex() ]);
        UserServiceRepository userService = new UserServiceRepository(userMocked.GetClient());

        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        UpdateLunarNotesBody updateBody = new UpdateLunarNotesBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "random",
            ProjectId = "projectSwag",
            NewNotes = GenerateNewNotes()
        };

        //act
        ContentResult? response = await controller.UpdateLunarNote(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "There should be an error the organization id is wrong");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Single(matchCase.Notes![0].Blocks!);
    }

    [Fact]
    public async Task BadProjectIdCase()
    {
        //collect
        LinkedUserServiceMocked userMocked = new LinkedUserServiceMocked([ GenerateUserIndex() ]);
        UserServiceRepository userService = new UserServiceRepository(userMocked.GetClient());

        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        UpdateLunarNotesBody updateBody = new UpdateLunarNotesBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "random",
            NewNotes = GenerateNewNotes()
        };

        //act
        ContentResult? response = await controller.UpdateLunarNote(updateBody) as ContentResult;
        string? content = response?.Content;

        //execute
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Single(matchCase.Notes![0].Blocks!);
    }

    [Fact]
    public async Task BadNewNotesCase()
    {
        //collect
        LinkedUserServiceMocked userMocked = new LinkedUserServiceMocked([ GenerateUserIndex() ]);
        UserServiceRepository userService = new UserServiceRepository(userMocked.GetClient());

        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        List<LunarNote> newNotes = GenerateNewNotes();
        newNotes[0].Blocks![1].BlockId = null;

        UpdateLunarNotesBody updateBody = new UpdateLunarNotesBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            NewNotes = newNotes
        };

        //act
        ContentResult? response = await controller.UpdateLunarNote(updateBody) as ContentResult;
        string? content = response?.Content;

        //execute
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "There should be an error the project id is wrong");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Single(matchCase.Notes![0].Blocks!);
    }
}