using MongoDB.Driver;
using SigmyzeServer.Models.Lunar;
using SigmyzeServer.Services.Web.Lunar;

namespace Test.Lunar;

public class LunarServiceUpdateChartTests
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

        List<LunarChart> newCharts = LunarDocumentTests.GenerateLunarCharts();
        newCharts[0].Indicators!.Add(new QuantaIndicatorLocation {
            DatasetId = "test-id",
            IndicatorId = "test-indicator"
        });

        //act
        await service.UpdateChart("orgId", "projectSwag", newCharts);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.NotEmpty(document.Charts![0].Indicators!);
    }

    [Fact]
    public async Task InvalidChartsCase()
    {
        //collect
        ServiceMockedData mocked = new ServiceMockedData(GenerateLunarDocuments());
        IMongoClient client = mocked.GetClient();

        IMongoDatabase db = client.GetDatabase("application::lunar");
        IMongoCollection<LunarDocument> collection = db.GetCollection<LunarDocument>("lunar_documents");
        LunarRefreshService service = new LunarRefreshService(client);

        List<LunarChart> newCharts = LunarDocumentTests.GenerateLunarCharts();
        newCharts[0].Indicators!.Add(new QuantaIndicatorLocation());

        //act
        await service.UpdateChart("orgId", "projectSwag", newCharts);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Empty(document.Charts![0].Indicators!);
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

        List<LunarChart> newCharts = LunarDocumentTests.GenerateLunarCharts();
        newCharts[0].Indicators!.Add(new QuantaIndicatorLocation {
            DatasetId = "test-id",
            IndicatorId = "test-indicator"
        });

        //act
        await service.UpdateChart("random", "projectSwag", newCharts);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Empty(document.Charts![0].Indicators!);
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

        List<LunarChart> newCharts = LunarDocumentTests.GenerateLunarCharts();
        newCharts[0].Indicators!.Add(new QuantaIndicatorLocation {
            DatasetId = "test-id",
            IndicatorId = "test-indicator"
        });

        //act
        await service.UpdateChart("orgId", "random", newCharts);

        //expect
        LunarDocument? document = await collection.Find(x => x.ProjectId == "projectSwag")
            .FirstOrDefaultAsync();

        Assert.NotNull(document);
        Assert.Empty(document.Charts![0].Indicators!);
    }
}