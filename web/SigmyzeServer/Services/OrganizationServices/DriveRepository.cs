using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;

namespace SigmyzeServer.Services.OrganizationServices;

public interface IDriveRepository
{
    Task<List<Drive>> GetAllAsync();
    Task<Drive?> GetDrive(string driveId);
    Task UpdateDrive(string driveId, Drive nOrganization);
    Task InsertDrive(Drive nDrive);
    Task DeleteDrive(string driveId);
}

public class DriveRepository : IDriveRepository
{
    private readonly IMongoCollection<Drive> _driveCollection;
    private readonly IProjectRepository _projectRepository;
    public DriveRepository(IMongoClient mongoClient, IProjectRepository projectRepository)
    {
        var mongoDatabse = mongoClient.GetDatabase("SigmyzeOrganizations");

        _driveCollection = mongoDatabse.GetCollection<Drive>("drives");
        _projectRepository = projectRepository;
    }

    //FEATURE: This retrieves all the drives in the collection
    public async Task<List<Drive>> GetAllAsync() =>
        await _driveCollection.Find(_ => true).ToListAsync();

    //FEATURE: This fetches the drive based on its driveid
    public async Task<Drive?> GetDrive(string driveId) =>
        await _driveCollection.Find(x => x.DriveId == driveId).FirstOrDefaultAsync();

    //FEATURE: This replaces the drive with a new one based on the driveId field
    public async Task UpdateDrive(string driveId, Drive nOrganization) =>
        await _driveCollection.ReplaceOneAsync(x => x.DriveId == driveId, nOrganization);

    //FEATURE: This inserts a new drive into the collection
    public async Task InsertDrive(Drive nDrive) =>
        await _driveCollection.InsertOneAsync(nDrive);

    //NOTE: Recursive function to find all the projects within the subfolders of the drive
    public List<ProjectView> FolderGetProjects(List<ProjectView> _projects, Folder folder)
    {
        List<ProjectView> projects = _projects;
        if(folder.Projects != null)
            for(int i = 0; i < folder.Projects.Count; i++)
                projects.Add(folder.Projects[i]);

        if(folder.Folders != null)
            for(int i = 0; i < folder.Folders.Count; i++)
                projects = FolderGetProjects(projects, folder.Folders[i]);

        return projects;
    }

    //NOTE: This is the helper function that finds all the projects that are within the drive
    public List<ProjectView> FindProjects(Drive drive)
    {
        List<ProjectView> projects = new List<ProjectView>();
        if(drive.Projects != null)
            for(int i = 0; i < drive.Projects.Count; i++)
                projects.Add(drive.Projects[i]);

        List<Folder>? folders = drive.Folders;
        if(folders != null)
        {
            for(int i = 0; i < folders.Count; i++)
            {
                Folder folder = folders[i];
                projects = FolderGetProjects(projects, folder);
            }
        }

        return projects;
    }

    //FEATURE: This function deletes the drive from the database, and all its children projects
    public async Task DeleteDrive(string driveId)
    {
        //cleanup components
        Drive? drive = await GetDrive(driveId);
        if(drive == null)
            return;

        await _driveCollection.DeleteOneAsync(x => x.DriveId == driveId);
        //NOTE: This finds all the projects that were created within the drive and deletes them from the project repository
        List<ProjectView> projects = FindProjects(drive);
        for(int i = 0; i < projects.Count; i++)
        {
            ProjectView project = projects[i];
            await _projectRepository.DeleteProject(project.ProjectId!);
        }
    }
}