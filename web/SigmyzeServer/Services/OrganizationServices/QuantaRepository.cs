using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;

namespace SigmyzeServer.Services.OrganizationServices;

public interface IQuantaRepository
{
    Task InitQuantaProject(string projectId, string projectName, string organizationId);
    Task<QuantaRepositoryDefinition?> GetProject(string projectId);
    Task DeleteProject(string projectId);
}

public class QuantaRepository : IQuantaRepository
{
    private readonly IMongoCollection<QuantaRepositoryDefinition> _quantaRepository;
    public QuantaRepository(IMongoClient mongoClient)
    {
        var mongoDatabse = mongoClient.GetDatabase("SigmyzeOrganizations");
        _quantaRepository = mongoDatabse.GetCollection<QuantaRepositoryDefinition>("quanta_projects");
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

        //create the files
        projectData.Files.Add(buildFile("Overview", "overview"));
        projectData.Files.Add(buildFile("Create Dataset", "node_editor"));
        projectData.Files.Add(buildFile("Update Dataset", "node_editor"));
        projectData.Files.Add(buildFile("Selectors", "selectors"));

        newProject.ProjectData = projectData;
        await _quantaRepository.InsertOneAsync(newProject);
    }

    public async Task<QuantaRepositoryDefinition?> GetProject(string projectId) =>
        await _quantaRepository.Find(x => x.ProjectId == projectId).FirstOrDefaultAsync();

    public async Task DeleteProject(string projectId) =>
        await _quantaRepository.DeleteOneAsync(x => x.ProjectId == projectId);

    private QuantaFile buildFile(string name, string type)
    {
        QuantaFile file = new QuantaFile();
        file.Name = name;
        file.Type = type;
        file.Id = Guid.NewGuid().ToString();

        return file;   
    }
}