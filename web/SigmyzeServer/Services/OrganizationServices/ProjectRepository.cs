using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;

namespace SigmyzeServer.Services.OrganizationServices;

public interface IProjectRepository
{
    Task<List<ProjectData>> GetAllAsync();
    Task<ProjectData?> GetProject(string projectId);
    Task CreateProject(ProjectData nProject);
    Task UpdateProject(string projectId, ProjectData nProject);
    Task DeleteProject(string projectId);
}

public class ProjectRepository : IProjectRepository
{
    private readonly IMongoCollection<ProjectData> _projectCollection;
    public ProjectRepository(IMongoClient mongoClient)
    {
        var mongoDatabse = mongoClient.GetDatabase("SigmyzeOrganizations");
        _projectCollection = mongoDatabse.GetCollection<ProjectData>("projects");
    }

    //FEATURE: This retrieves all the projects from the collection
    public async Task<List<ProjectData>> GetAllAsync() =>
        await _projectCollection.Find(_ => true).ToListAsync();
    //FEATURE: This fetches a project from the collection based on its projectId
    public async Task<ProjectData?> GetProject(string projectId) =>
        await _projectCollection.Find(x => x.ProjectId == projectId).FirstOrDefaultAsync();
    //FEATURE: This inserts a new project into the projects collection
    public async Task CreateProject(ProjectData nProject) => 
        await _projectCollection.InsertOneAsync(nProject);
    //FEATURE: This function replaces a project with another one, by using the projectId field
    public async Task UpdateProject(string projectId, ProjectData nProject) =>
        await _projectCollection.ReplaceOneAsync(x => x.ProjectId == projectId, nProject);
    //FEATURE: This deletes a project from the collection based on its project id
    public async Task DeleteProject(string projectId) =>
        await _projectCollection.DeleteOneAsync(x => x.ProjectId == projectId);
}