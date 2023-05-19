using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services.OrganizationServices;

public interface IOrganizationRepository 
{
    Task<List<Organization>> GetAllAsync();
    Task<Organization?> GetOrganization(string organization_id);
    Task InsertOrganization(Organization organization);
    Task UpdateOrganization(string organization_id, Organization nOrganization);
    Task DeleteOrganization(string organization_id);
}

public class OrganizationRepository : IOrganizationRepository 
{
    private readonly IMongoCollection<Organization> _organizationCollection;
    private readonly IDriveRepository _driveRepository;

    public OrganizationRepository(IMongoClient mongoClient, IDriveRepository driveRepository)
    {
        var mongoDatabase = mongoClient.GetDatabase("SigmyzeOrganizations");

        _organizationCollection = mongoDatabase.GetCollection<Organization>("organizations");
        _driveRepository = driveRepository;
    }

    //FEATURE: This grabs all the organizations in the collection 
    public async Task<List<Organization>> GetAllAsync() =>
        await _organizationCollection.Find(_ => true).ToListAsync();
    
    //FEATURE: This grabs an organization based on the organization's id
    public async Task<Organization?> GetOrganization(string organization_id) =>
        await _organizationCollection.Find(x => x.OrganizationId == organization_id).FirstOrDefaultAsync();
    
    //FEATURE: This inserts an organization into the collection
    public async Task InsertOrganization(Organization organization)
    {
        //NOTE: Creates the drive service since an organization needs a drive for data storage
        Drive drive = new Drive();
        drive.DriveId = new Guid().ToString();
        drive.Folders = new List<Folder>();
        drive.Projects = new List<ProjectView>();
        await _driveRepository.InsertDrive(drive);

        //NOTE: add the linked drive id to the organization object
        organization.LinkedDriveId = drive.DriveId;
        await _organizationCollection.InsertOneAsync(organization);
    }
    
    //FEATURE: This updates the organization in the collection based on its organization_id
    public async Task UpdateOrganization(string organization_id, Organization nOrganization) =>
        await _organizationCollection.ReplaceOneAsync(x => x.OrganizationId == organization_id, nOrganization);
    
    //FEATURE: This deletes an organization from the collection, along with its linked drive
    public async Task DeleteOrganization(string organization_id)
    {
        //NOTE: Get the organization so that we may delete the drive as well
        Organization? organization = await GetOrganization(organization_id);
        if(organization == null)
            return;

        //NOTE: deleting the drive and organization
        await _driveRepository.DeleteDrive(organization.LinkedDriveId!);
        await _organizationCollection.DeleteOneAsync(x => x.OrganizationId == organization_id);
    }
}