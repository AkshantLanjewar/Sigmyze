namespace SigmyzeServer.Services.Web.Lunar;

using MongoDB.Driver;
using SigmyzeServer.Models.Lunar;

public interface ILunarRefreshService 
{
    //this is the function that creates a project
    public Task<string?> CreateProject(string organizationId, string projectId, string name);

    //this is the function that deletes a project
    public Task DeleteProject(string organizationId, string projectId);

    //this is the function that Fetches a projects data
    public Task<LunarProjectData?> GetProjectData(string organizationId, string projectId); 

    //this is the function that updates the filetree
    public Task UpdateFileTree(string organizationId, string projectId, SimpleFilesystem newFileTre);

    //this is the function that updates the chart data
    public Task UpdateChart(string organizationId, string projectId, List<LunarChart> newCharts);

    //this is the function that updates the note data
    public Task UpdateNote(string organizationId, string projectId, List<LunarNote> newNotes);

    //this is the function that updates the project name
    public Task UpdateName(string organizationId, string projectId, string name);
}


public partial class LunarRefreshService : ILunarRefreshService
{
    private readonly IMongoCollection<LunarDocument> _collection;
    
    public LunarRefreshService(IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase("application::lunar");
        _collection = database.GetCollection<LunarDocument>("lunar_documents");
    }
}