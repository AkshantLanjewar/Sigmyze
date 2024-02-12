using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using SigmyzeServer.Controllers;
using SigmyzeServer.Controllers.Lunar;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.Lunar;
using SigmyzeServer.Services.OrganizationServices;
using SigmyzeServer.Services.Web.Lunar;
using Xunit.Abstractions;

namespace Test.Lunar;

public class LunarCreateEndpointTests
{
    private readonly ITestOutputHelper output;

    public LunarCreateEndpointTests(ITestOutputHelper output)
    {
        this.output = output;
    }

    //this is a function to generate a valid serviceIndex
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
        CreateLunarProjectBody createBody = new CreateLunarProjectBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "giggity-quagmire",
            Name = "Quagmire's test project" 
        };

        //act
        ContentResult? response = await controller.CreateLunarProject(createBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        CreateLunarProjectResponse? parsed = JsonConvert.DeserializeObject<CreateLunarProjectResponse>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Success(), "This was a successful request to create a project body");

        //check it was created
        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "giggity-quagmire").FirstOrDefaultAsync();
        Assert.NotNull(matchDocument);
    }

    [Fact]
    public async Task ProjectIdMatchesCase()
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
        CreateLunarProjectBody createBody = new CreateLunarProjectBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            Name = "Quagmire's test project" 
        };

        //act
        ContentResult? response = await controller.CreateLunarProject(createBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        CreateLunarProjectResponse? parsed = JsonConvert.DeserializeObject<CreateLunarProjectResponse>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Success(), "This was a successful request to create a project body");

        //check the new id isnt blank
        Assert.NotNull(parsed.NewId);

        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == parsed.NewId).FirstOrDefaultAsync();
        Assert.NotNull(matchDocument);
    }

    [Fact]
    public async Task LunarIdInvalidCase()
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
        CreateLunarProjectBody createBody = new CreateLunarProjectBody 
        {
            LunarId = "lunar-id",
            OrganizationId = "orgId",
            ProjectId = "new-project-id",
            Name = "Quagmire's test project" 
        };

        //act
        ContentResult? response = await controller.CreateLunarProject(createBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        CreateLunarProjectResponse? parsed = JsonConvert.DeserializeObject<CreateLunarProjectResponse>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Success(), "The Lunar ID does not belong within the organization");

        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "new-project-id").FirstOrDefaultAsync();
        Assert.Null(matchDocument);
    }

    [Fact]
    public async Task OrganizationIdDoesNotExistCase()
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
        CreateLunarProjectBody createBody = new CreateLunarProjectBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "diffOrg",
            ProjectId = "giggity-quagmire",
            Name = "Quagmire's test project" 
        };

        //act
        ContentResult? response = await controller.CreateLunarProject(createBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        CreateLunarProjectResponse? parsed = JsonConvert.DeserializeObject<CreateLunarProjectResponse>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Success(), "The Lunar ID does not belong within the organization");

        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "giggity-quagmire").FirstOrDefaultAsync();
        Assert.Null(matchDocument);
    }

    [Fact]
    public async Task InvalidCreateBodyCase()
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
        CreateLunarProjectBody createBody = new CreateLunarProjectBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "giggity-quagmire",
        };

        //act
        ContentResult? response = await controller.CreateLunarProject(createBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        CreateLunarProjectResponse? parsed = JsonConvert.DeserializeObject<CreateLunarProjectResponse>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Success(), "The Lunar ID does not belong within the organization");

        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "giggity-quagmire").FirstOrDefaultAsync();
        Assert.Null(matchDocument);
    }
}