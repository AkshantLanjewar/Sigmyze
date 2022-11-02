using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Organizations;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.UserData;
using SigmyzeServer.Services;
using SigmyzeServer.Services.Auth;
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

	public OrganizationController
		(ITokenDataService tokenDataService, IDriveService driveService, IUserAuth userAuth, IOrganizationService organizationService) 
		: base(tokenDataService, driveService, userAuth, organizationService)
	{

		_organizationService = organizationService;
		_driveService = driveService;
	}

	[HttpGet]
	[MapToApiVersion("1.0")]
	public async Task<IActionResult> OrganizationsRoot()
	{
		RootResponse response = new RootResponse();
		APIStatusMsg status = new APIStatusMsg();
		
		status.Error = false;
		status.MSG = "Organizations working";
		response.Status = status;

		User user = await GetUser();
		if (user.Organizations == null)
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
}