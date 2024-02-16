using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using SigmyzeServer.Controllers;
using SigmyzeServer.Controllers.Lunar;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.Lunar;
using SigmyzeServer.Services.OrganizationServices;
using SigmyzeServer.Services.Web.Lunar;

namespace Test.Lunar;

public class FetchProjectDataEndpointTests
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
        LunarRefreshService service = new LunarRefreshService(client);

        LunarRefreshController controller = new LunarRefreshController(userService, service);

        //act
        ContentResult? result = await controller.FetchLunarProjectData("test-lunar-id", "orgId", "projectSwag") as ContentResult;
        string? content = result?.Content;

        //expect
        Assert.NotNull(content);
        FetchProjectDataResponse? parsed = JsonConvert.DeserializeObject<FetchProjectDataResponse>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Success(), "This is a successfull query for project data");

        //validate that the folder-0 is Swag
        Assert.NotNull(parsed.ProjectData);
        Assert.Equal("Swag", parsed.ProjectData.Filesystem!.Folders![0].FolderName!);
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
        LunarRefreshService service = new LunarRefreshService(client);
        LunarRefreshController controller = new LunarRefreshController(userService, service);

        //act
        ContentResult? result = await controller.FetchLunarProjectData("lunar-id", "orgId", "projectSwag") as ContentResult;
        string? content = result?.Content;

        //expect
        Assert.NotNull(content);
        FetchProjectDataResponse? parsed = JsonConvert.DeserializeObject<FetchProjectDataResponse>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Success(), "The lunar ID is invalid for this request");
        Assert.Null(parsed.ProjectData);
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
        LunarRefreshService service = new LunarRefreshService(client);
        LunarRefreshController controller = new LunarRefreshController(userService, service);

        //act
        ContentResult? result = await controller.FetchLunarProjectData("test-lunar-id", "swag", "projectSwag") as ContentResult;
        string? content = result?.Content;

        //expect
        Assert.NotNull(content);
        FetchProjectDataResponse? parsed = JsonConvert.DeserializeObject<FetchProjectDataResponse>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Success(), "The organizationId is wrong for this request");
        Assert.Null(parsed.ProjectData);
    }

    [Fact]
    public async Task BadProjectIdCae()
    {
        //collect
        LinkedUserServiceMocked userMocked = new LinkedUserServiceMocked([ GenerateUserIndex() ]);
        UserServiceRepository userService = new UserServiceRepository(userMocked.GetClient());
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        LunarRefreshService service = new LunarRefreshService(client);
        LunarRefreshController controller = new LunarRefreshController(userService, service);

        //act
        ContentResult? result = await controller.FetchLunarProjectData("test-lunar-id", "orgId", "lolzord") as ContentResult;
        string? content = result?.Content;

        //expect
        Assert.NotNull(content);
        FetchProjectDataResponse? parsed = JsonConvert.DeserializeObject<FetchProjectDataResponse>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Success(), "The organizationId is wrong for this request");
        Assert.Null(parsed.ProjectData);
    }
}