using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Organizations;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.UserData;
using SigmyzeServer.Services;
using SigmyzeServer.Services.DatabaseServices;

namespace SigmyzeServer.Controllers.UserDataControllers;

[ApiController]
[Authorize]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/organizations")]
public class OrganizationController : DataControllerBase
{
	private readonly IOrganizationService _organizationService;
	private readonly IDriveService _driveService;
	private bool checkFlag;

	public OrganizationController
		(ITokenDataService tokenDataService, IDriveService driveService, IUserAuth userAuth, IOrganizationService organizationService) 
		: base(tokenDataService, driveService, userAuth, organizationService)
	{

		_organizationService = organizationService;
		_driveService = driveService;
		checkFlag     = false;
	}

	[HttpGet]
	[MapToApiVersion("1.0")]
	public async Task<IActionResult> OrganizationsRoot()
	{
		await createLunarOrganization();
		RootResponse response = new RootResponse();
		APIStatusMsg status = new APIStatusMsg();
		
		status.Error = false;
		status.MSG = "Organizations working";
		response.Status = status;

		User user = await GetUser();
		if (user.Organizations == null || user.Organizations.Count == 0)
		{
			string organizationId = await _organizationService.CreateUserOrganization(user);
			user.Organizations = new List<string> { organizationId };
			
			await SaveUser(user);
		}

		List<Organization> organizations = new List<Organization>();
		for (int i = 0; i < user.Organizations.Count; i++)
		{
			string organizationId = user.Organizations[i];
			Organization? organization = await _organizationService.GetOrganization(organizationId);
			if (organization == null)
			{
				user.Organizations.RemoveAt(i);
				
				await SaveUser(user);
				continue;
			}

			organizations.Add(organization);
		}

		response.Organizations = organizations;
		return await SerializeJson(response);
	}

	[HttpGet("organization/{organizationId}")]
	[MapToApiVersion("1.0")]
	public async Task<IActionResult> GetOrganization(string organizationId)
	{
		OrganizationResponse response = new OrganizationResponse();
		APIStatusMsg status = new APIStatusMsg();
		
		status.Error = false;
		status.MSG = "Organization endpoint working";
		response.Status = status;

		Organization? organization = await _organizationService.GetOrganization(organizationId);
		if (organization == null)
		{
			status.Error = true;
			status.MSG = "Organization does not exist";
			response.Status = status;

			return await SerializeJson(status);
		}
		
		Drive drive = await _driveService.GetDrive(organization.OrganizationDrive!);
		
		response.Organization = organization;
		response.Drive = drive;
		return await SerializeJson(response);
	}

	[HttpGet("organization/{organizationId}/projects/{projectId}")]
	[MapToApiVersion("1.0")]
	public async Task<IActionResult> GetOrganizationProject(string organizationId, string projectId)
	{
		Console.WriteLine(organizationId);
		ProjectResp resp = await GetProject(organizationId, projectId);
		return await SerializeJson(resp);
	}

	private async Task createOrganization(string admin, string id, string name)
	{
		Organization organization = new Organization();
		organization.OrganizationId = id;
		organization.OrganizationName = name;
		organization.OrganizationAdmin = admin;
		organization.UserOrganization = false;
		organization.OrganizationDrive = id;
		organization.OrganizationUsers = new List<string>();
		organization.OrganizationPublishers = new List<string>();
		organization.HasPage = true;
		organization.PageId  = "sigmyze_root";

		//create the drive
		Drive drive = await _driveService.GetDrive(id);
		await _organizationService.CreateOrganization(organization);
	}

	private async Task createLunarOrganization()
	{
		if(checkFlag)
			return;
		Organization? organization = await _organizationService.GetOrganization("sigmyze_root");
		if(organization != null)
			return;

		await createOrganization("", "sigmyze_root", "Sigmyze");
		checkFlag = true;
	}
}