using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Organizations;
using SigmyzeServer.Models.User;
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
	private readonly IUserAuth _userAuth;
	private readonly ITokenDataService _tokenDataService;
	private readonly IOrganizationService _organizationService;

	public OrganizationController(ITokenDataService tokenDataService, IDriveService driveService, IUserAuth userAuth, IOrganizationService organizationService) : base(tokenDataService, driveService, userAuth)
	{
		_tokenDataService = tokenDataService;
		_userAuth = userAuth;
		_organizationService = organizationService;
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
}