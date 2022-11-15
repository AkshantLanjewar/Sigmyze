using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SigmyzeServer.Models.Organizations;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.UserData;

namespace SigmyzeServer.Services.DatabaseServices;

public interface IOrganizationService
{
	Task<string> CreateUserOrganization(User user);
	Task<Organization?> GetOrganization(string organizationId);
}

public class OrganizationService : IOrganizationService
{
	private readonly IMongoCollection<Organization> _organizationCollection;
	private readonly IMongoCollection<Drive> _driveColletion;

	public OrganizationService(IOptions<AuthDatabaseSettings> authDatabaseSettings)
	{
		var mongoClient = new MongoClient(authDatabaseSettings.Value.ConnectionString);
		var mongoDatabase = mongoClient.GetDatabase("SigmyzeOrganizations");
		
		_organizationCollection = mongoDatabase.GetCollection<Organization>("organizations");
		_driveColletion = mongoDatabase.GetCollection<Drive>("organization_drives");
	}

	public async Task<string> CreateUserOrganization(User user)
	{
		Organization organization = new Organization();
		organization.OrganizationId = Guid.NewGuid().ToString();
		organization.OrganizationName = $"{user.Username}'s Page";
		organization.OrganizationAdmin = user.LunarId;
		organization.UserOrganization = true;
		organization.OrganizationDrive = user.LunarId;
		organization.OrganizationUsers = new List<string>();
		organization.OrganizationPublishers = new List<string>();

		await _organizationCollection.InsertOneAsync(organization);
		return organization.OrganizationId;
	}

	public async Task<Organization?> GetOrganization(string organizationId)
	{
		Organization? organization =
			await _organizationCollection.Find(x => x.OrganizationId == organizationId).FirstOrDefaultAsync();
		if (organization == null)
			return null;

		return organization;
	}
}