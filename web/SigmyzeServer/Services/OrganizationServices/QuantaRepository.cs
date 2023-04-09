using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services.OrganizationServices;

public interface IQuantaRepository
{
    Task InitQuantaProject(string projectId, string projectName, string organizationId);
    Task<QuantaRepositoryDefinition?> GetProject(string projectId);
    Task DeleteProject(string projectId);
    Task UpdateProject(string projectId, QuantaRepositoryDefinition nProject);
    Task<QuantaProjectCacheId?> GetQuantaProjectCache(string projectId, string processId);
    Task DeleteQuantaProjectCache(string projectId, string processId);
    Task CreateQuantaProjectCache(string organizationId, string projectId, string processId);
}

public class QuantaRepository : IQuantaRepository
{
    private readonly IMongoCollection<QuantaRepositoryDefinition> _quantaRepository;
    private readonly IMongoCollection<QuantaProjectCacheId> _quantaProjectCache;
    public QuantaRepository(IOptions<AuthDatabaseSettings> authDatabaseSettings)
    {
        var mongoClient = new MongoClient(authDatabaseSettings.Value.ConnectionString);
        var mongoDatabse = mongoClient.GetDatabase("SigmyzeOrganizations");

        _quantaRepository = mongoDatabse.GetCollection<QuantaRepositoryDefinition>("quanta_projects");
        _quantaProjectCache = mongoDatabse.GetCollection<QuantaProjectCacheId>("quanta_project_cache");
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

    public async Task<QuantaRepositoryDefinition?> GetProject(string projectId) =>
        await _quantaRepository.Find(x => x.ProjectId == projectId).FirstOrDefaultAsync();

    public async Task DeleteProject(string projectId) =>
        await _quantaRepository.DeleteOneAsync(x => x.ProjectId == projectId);

    public async Task UpdateProject(string projectId, QuantaRepositoryDefinition nProject) =>
        await _quantaRepository.ReplaceOneAsync(x => x.ProjectId == projectId, nProject);

    private QuantaFile buildFile(string name, string type)
    {
        QuantaFile file = new QuantaFile();
        file.Name = name;
        file.Type = type;
        file.Id = Guid.NewGuid().ToString();

        return file;   
    }
}