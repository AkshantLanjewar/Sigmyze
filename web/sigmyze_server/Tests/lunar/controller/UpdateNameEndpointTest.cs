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

public class UpdateNameEndpointTests
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

    [Fact]
    public async Task BaseCase()
    {
        //collect
        LinkedUserServiceMocked userMocked = new LinkedUserServiceMocked([ GenerateUserIndex() ]);
        UserServiceRepository userService = new UserServiceRepository(userMocked.GetClient());

        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        UpdateLunarNameBody updateBody = new UpdateLunarNameBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            Name = "lolzor-name"
        };

        //act
        ContentResult? response = await controller.UpdateLunarName(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Error, "There should be no error the file should be updated");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Equal("lolzor-name", matchCase.ProjectName);
        Assert.Equal("lolzor-name", matchCase.Filesystem!.Folders![0].FolderName);
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
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        UpdateLunarNameBody updateBody = new UpdateLunarNameBody 
        {
            LunarId = "lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            Name = "lolzor-name"
        };

        //act
        ContentResult? response = await controller.UpdateLunarName(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "The Lunar ID is wrong");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.NotEqual("lolzor-name", matchCase.ProjectName);
        Assert.NotEqual("lolzor-name", matchCase.Filesystem!.Folders![0].FolderName);
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
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        UpdateLunarNameBody updateBody = new UpdateLunarNameBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "random",
            ProjectId = "projectSwag",
            Name = "lolzor-name"
        };

        //act
        ContentResult? response = await controller.UpdateLunarName(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "The Organization ID is wrong");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.NotEqual("lolzor-name", matchCase.ProjectName);
        Assert.NotEqual("lolzor-name", matchCase.Filesystem!.Folders![0].FolderName);
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
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        UpdateLunarNameBody updateBody = new UpdateLunarNameBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "lol",
            Name = "lolzor-name"
        };

        //act
        ContentResult? response = await controller.UpdateLunarName(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "The Project ID is wrong");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.NotEqual("lolzor-name", matchCase.ProjectName);
        Assert.NotEqual("lolzor-name", matchCase.Filesystem!.Folders![0].FolderName);
    }

    [Fact]
    public async Task BadBodyCase()
    {
        //collect
        LinkedUserServiceMocked userMocked = new LinkedUserServiceMocked([ GenerateUserIndex() ]);
        UserServiceRepository userService = new UserServiceRepository(userMocked.GetClient());

        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        UpdateLunarNameBody updateBody = new UpdateLunarNameBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
        };

        //act
        ContentResult? response = await controller.UpdateLunarName(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "The body is wrong");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.NotEqual("lolzor-name", matchCase.ProjectName);
        Assert.NotEqual("lolzor-name", matchCase.Filesystem!.Folders![0].FolderName);
    }
}