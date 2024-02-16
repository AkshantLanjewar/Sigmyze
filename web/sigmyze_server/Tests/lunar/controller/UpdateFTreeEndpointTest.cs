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

public class UpdateFileTreeEndpointTests
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

    public SimpleFilesystem GenerateNewFilesystem()
    {
        SimpleFilesystem filesystem = LunarDocumentTests.GenerateValidSimpleFilesystem("Swag");
        SimpleFolder folder = new SimpleFolder
        {
            FolderId = "new-folder-id",
            FolderName = "New Folder",
            Folders = new List<SimpleFolder>(),
            Files = new List<string>()
        };

        filesystem.Folders![0].Folders!.Add(folder);
        return filesystem;
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
        UpdateLunarFileTreeBody updateBody = new UpdateLunarFileTreeBody
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            NewFiletree = GenerateNewFilesystem()
        };

        //act
        ContentResult? response = await controller.UpdateLunarFileTree(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Error, "There should be no error the file should be updated");

        //we need to check that the project has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Single(matchCase.Filesystem!.Folders![0].Folders!);
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
        UpdateLunarFileTreeBody updateBody = new UpdateLunarFileTreeBody
        {
            LunarId = "lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            NewFiletree = GenerateNewFilesystem()
        };

        //act
        ContentResult? response = await controller.UpdateLunarFileTree(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "There should be an error the lunar id is not valid");

        //we need to check that the project has actually been not updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Empty(matchCase.Filesystem!.Folders![0].Folders!);
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
        UpdateLunarFileTreeBody updateBody = new UpdateLunarFileTreeBody
        {
            LunarId = "test-lunar-id",
            OrganizationId = "random",
            ProjectId = "projectSwag",
            NewFiletree = GenerateNewFilesystem()
        };

        //act
        ContentResult? response = await controller.UpdateLunarFileTree(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "There should be an error the lunar id is not valid");

        //we need to check that the project has actually been not updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Empty(matchCase.Filesystem!.Folders![0].Folders!);
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
        UpdateLunarFileTreeBody updateBody = new UpdateLunarFileTreeBody
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "random",
            NewFiletree = GenerateNewFilesystem()
        };

        //act
        ContentResult? response = await controller.UpdateLunarFileTree(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        //we need to check that the project has actually been not updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Empty(matchCase.Filesystem!.Folders![0].Folders!);
    }

    [Fact]
    public async Task BadNewFilesystem()
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
        SimpleFilesystem newFilesystem = GenerateNewFilesystem();
        newFilesystem.Folders![0].Folders![0].Folders = null;

        UpdateLunarFileTreeBody updateBody = new UpdateLunarFileTreeBody
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            NewFiletree = newFilesystem
        };

        //act
        ContentResult? response = await controller.UpdateLunarFileTree(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "There should be an error the lunar id is not valid");

        //we need to check that the project has actually been not updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Empty(matchCase.Filesystem!.Folders![0].Folders!);
    }
}