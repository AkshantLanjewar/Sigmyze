using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services.OrganizationServices;

public interface IQuantaRepository
{
    Task InitQuantaProject(string projectId, string projectName, string organizationId);
    Task DeleteProject(string projectId);
    Task<QuantaProjectCacheId?> GetQuantaProjectCache(string projectId, string processId);
    Task DeleteQuantaProjectCache(string projectId, string processId);
    Task CreateQuantaProjectCache(string organizationId, string projectId, string processId);
    Task<GetIndicatorsQuery?> GetProjectIndicators(string projectId, int page, int pageLen);
    Task<GetProjectDataQuery?> GetProjectData(string projectId);
    Task UpdateProjectData(string projectId, QuantaProjectData data);
}

public class QuantaRepository : IQuantaRepository
{
    private readonly IMongoCollection<QuantaRepositoryDefinition> _quantaRepository;
    private readonly IMongoCollection<QuantaProjectCacheId> _quantaProjectCache;
    private readonly IMongoCollection<QuantaIndicatorRepositoryDef> _quantaIndicators;

    public QuantaRepository(IOptions<AuthDatabaseSettings> authDatabaseSettings)
    {
        var mongoClient = new MongoClient(authDatabaseSettings.Value.ConnectionString);
        var mongoDatabse = mongoClient.GetDatabase("SigmyzeOrganizations");

        _quantaRepository = mongoDatabse.GetCollection<QuantaRepositoryDefinition>("quanta_projects");
        _quantaProjectCache = mongoDatabse.GetCollection<QuantaProjectCacheId>("quanta_project_cache");
        _quantaIndicators = mongoDatabse.GetCollection<QuantaIndicatorRepositoryDef>("quanta_indicators");

        //build the index's
        var quantaIdIndex = Builders<QuantaRepositoryDefinition>.IndexKeys.Ascending(x => x.ProjectId);
        _quantaRepository.Indexes.CreateOne(new CreateIndexModel<QuantaRepositoryDefinition>(quantaIdIndex));
    }

    public async Task InitQuantaProject(string projectId, string projectName, string organizationId)
    {
        QuantaRepositoryDefinition newProject = new QuantaRepositoryDefinition();
        newProject.ProjectId = projectId;
        newProject.ProjectName = projectName;
        newProject.OrganizationId = organizationId;

        //handles the initialization of a blank default quanta project
        QuantaProjectData projectData = new QuantaProjectData();
        projectData.DatasetName = projectName;
        projectData.DatasetId = "dataset_id";
        projectData.DatasetDescription = "Type Description";
        projectData.Files = new List<QuantaFile>();
        projectData.Store = new QuantaDataStore();
        projectData.DatasetSchema = new List<QuantaSchemas>();

        //default store item
        projectData.Store.Selectors = new List<QuantaSelector>();

        //create the files
        projectData.Files.Add(buildFile("Overview", "overview"));
        projectData.Files.Add(buildFile("Create Dataset", "node_editor"));
        projectData.Files.Add(buildFile("Update Dataset", "node_editor"));
        projectData.Files.Add(buildFile("Selectors", "selectors"));

        newProject.ProjectData = projectData;
        await _quantaRepository.InsertOneAsync(newProject);

        //create the indicators document
        QuantaIndicatorRepositoryDef newIndicators = new QuantaIndicatorRepositoryDef();
        newIndicators.QuantaId = projectId;
        newIndicators.ProjectIndicators = new List<QuantaIndicator>();

        await _quantaIndicators.InsertOneAsync(newIndicators);
    }

    public async Task<QuantaProjectCacheId?> GetQuantaProjectCache(string projectId, string processId) =>
        await _quantaProjectCache.Find(x => x.ProcessId == processId && x.ProjectId == projectId).FirstOrDefaultAsync();

    public async Task DeleteQuantaProjectCache(string projectId, string processId) =>
        await _quantaProjectCache.DeleteOneAsync(x => x.ProcessId == processId && x.ProjectId == projectId);
    
    public async Task CreateQuantaProjectCache(string organizationId, string projectId, string processId)
    {
        QuantaProjectCacheId? potentialCache = await GetQuantaProjectCache(projectId, processId);
        if(potentialCache != null)
            await DeleteQuantaProjectCache(projectId, processId);

        QuantaProjectCacheId quantaCache = new QuantaProjectCacheId();
        quantaCache.OrganizationId = organizationId;
        quantaCache.ProjectId = projectId;
        quantaCache.ProcessId = processId;

        await _quantaProjectCache.InsertOneAsync(quantaCache);
    }

    public async Task UpdateProjectData(string projectId, QuantaProjectData data)
    {
        var filter = Builders<QuantaRepositoryDefinition>.Filter.Eq(x => x.ProjectId, projectId);
        var update = Builders<QuantaRepositoryDefinition>.Update
            .Set(x => x.ProjectData, data);

        await _quantaRepository.UpdateOneAsync(filter, update);
    }

    public async Task<GetProjectDataQuery?> GetProjectData(string projectId)
    {
        BsonDocument matchStage = new BsonDocument{
            {
                "$match", new BsonDocument{
                    { "project_id", projectId }
                }
            }
        };

        BsonDocument projectStage = new BsonDocument {
            {
                "$project", new BsonDocument {
                    {
                        "_id", 0
                    },
                    {
                        "project_data", "$project_data"
                    },
                    {
                        "project_id", "$project_id"
                    },
                    {
                        "project_name", "$project_name"
                    }
                }
            }
        };

        BsonDocument[] pipeline = new BsonDocument[]
        {
            matchStage,
            projectStage
        };

        List<GetProjectDataQuery> results = await _quantaRepository.Aggregate<GetProjectDataQuery>(pipeline).ToListAsync();
        if(results.Count == 0)
            return null;

        return results[0];
    }

    public async Task<GetIndicatorsQuery?> GetProjectIndicators(string projectId, int page, int pageLen)
    {
        page = page * pageLen;

        BsonDocument matchStage = new BsonDocument{
            {
                "$match", new BsonDocument{
                    { "project_id", projectId }
                }
            }
        };

        BsonDocument projectStage = new BsonDocument {
            { 
                "$project", new BsonDocument {
                    {
                        "indicators", new BsonDocument {
                            {
                                "$slice", new BsonArray {
                                    "$project_indicators",
                                    page,
                                    pageLen
                                }
                            }
                        }
                    },
                    {
                        "_id", 0
                    }
                } 
            }
        };

        BsonDocument[] pipeline = new BsonDocument[]
        {
            matchStage,
            projectStage
        };

        List<GetIndicatorsQuery> results = await _quantaIndicators.Aggregate<GetIndicatorsQuery>(pipeline).ToListAsync();
        if(results.Count == 0)
            return null;

        return results[0];
    }

    public async Task DeleteProject(string projectId) 
    {
        await _quantaRepository.DeleteOneAsync(x => x.ProjectId == projectId);
        await _quantaIndicators.DeleteOneAsync(x => x.QuantaId == projectId);
    }

    private QuantaFile buildFile(string name, string type)
    {
        QuantaFile file = new QuantaFile();
        file.Name = name;
        file.Type = type;
        file.Id = Guid.NewGuid().ToString();

        return file;   
    }
}