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

public class UpdateChartEndpointTests
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

    public List<LunarChart> GenerateNewCharts()
    {
        List<LunarChart> charts = LunarDocumentTests.GenerateLunarCharts();
        charts[0].Indicators!.Add(new QuantaIndicatorLocation {
            IndicatorId = "swag",
            DatasetId = "boss"
        });

        return charts;
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
        UpdateLunarChartsBody updateBody = new UpdateLunarChartsBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            NewCharts = GenerateNewCharts()
        };

        //act
        ContentResult? response = await controller.UpdateLunarChart(updateBody) as ContentResult;
        string? content = response?.Content;

        //execute
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.False(parsed.Error, "There should be no error the file should be updated");

        //check that the document has actually been updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Single(matchCase.Charts![0].Indicators!);
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
        UpdateLunarChartsBody updateBody = new UpdateLunarChartsBody 
        {
            LunarId = "lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            NewCharts = GenerateNewCharts()
        };

        //act
        ContentResult? response = await controller.UpdateLunarChart(updateBody) as ContentResult;
        string? content = response?.Content;

        //execute
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "There should be an error the lunar id is not valid");

        //check that the projec has not updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Empty(matchCase.Charts![0].Indicators!);
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
        UpdateLunarChartsBody updateBody = new UpdateLunarChartsBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "random",
            ProjectId = "projectSwag",
            NewCharts = GenerateNewCharts()
        };

        //act
        ContentResult? response = await controller.UpdateLunarChart(updateBody) as ContentResult;
        string? content = response?.Content;

        //execute
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "There should be an error the lunar id is not valid");

        //check that the projec has not updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Empty(matchCase.Charts![0].Indicators!);
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
        UpdateLunarChartsBody updateBody = new UpdateLunarChartsBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "random",
            NewCharts = GenerateNewCharts()
        };

        //execute
        ContentResult? response = await controller.UpdateLunarChart(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        //check that the projec has not updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Empty(matchCase.Charts![0].Indicators!);
    }

    [Fact]
    public async Task BadNewChartsCase()
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
        List<LunarChart> newCharts = GenerateNewCharts();
        newCharts[0].Indicators![0].DatasetId = null;

        UpdateLunarChartsBody updateBody = new UpdateLunarChartsBody 
        {
            LunarId = "test-lunar-id",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            NewCharts = newCharts 
        };

        //act
        ContentResult? response = await controller.UpdateLunarChart(updateBody) as ContentResult;
        string? content = response?.Content;

        //expect
        Assert.NotNull(content);
        APIStatusMsg? parsed = JsonConvert.DeserializeObject<APIStatusMsg>(content!);

        Assert.NotNull(parsed);
        Assert.True(parsed.Error, "There should be an error the lunar id is not valid");

        //check that the projec has not updated
        LunarDocument? matchCase = await collection.Find(x => x.ProjectId == "projectSwag").FirstOrDefaultAsync();

        Assert.NotNull(matchCase);
        Assert.Empty(matchCase.Charts![0].Indicators!);
    }
}