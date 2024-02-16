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

public class DeleteEndpointTests
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
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);
        DeleteLunarProjectBody deleteBody = new DeleteLunarProjectBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
        };

        //act
        ContentResult? response = await controller.DeleteLunarProject(deleteBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Error, "There should be no error the file should be deleted");

        //check if there is no project swag anymore
        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();
        Assert.Null(matchDocument);
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
        DeleteLunarProjectBody deleteBody = new DeleteLunarProjectBody 
        {
            LunarId = "lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
        };

        //act
        ContentResult? response = await controller.DeleteLunarProject(deleteBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "The Lunar ID does not match at all");

        //there should still be a project swag
        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();
        Assert.NotNull(matchDocument);
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
        DeleteLunarProjectBody deleteBody = new DeleteLunarProjectBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "zorgId",
            ProjectId = "projectSwag",
        };

        //act
        ContentResult? response = await controller.DeleteLunarProject(deleteBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "The Organization ID does not match at all");

        //there should still be a project swag
        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();
        Assert.NotNull(matchDocument);
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
        DeleteLunarProjectBody deleteBody = new DeleteLunarProjectBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSlag",
        };

        //act
        ContentResult? response = await controller.DeleteLunarProject(deleteBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        //there should still be a project swag
        LunarDocument? matchDocument = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();
        Assert.NotNull(matchDocument);
    }
}