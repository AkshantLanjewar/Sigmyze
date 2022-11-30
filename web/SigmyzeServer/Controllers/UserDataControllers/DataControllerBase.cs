using Microsoft.AspNetCore.Authentication;
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

public class DataControllerBase : ControllerBase
{
	private readonly ITokenDataService _tokenDataService;
	private readonly IDriveService _driveService;
	private readonly IUserAuth _userAuth;
	private readonly IOrganizationService _organizationService;
	
	public DataControllerBase(ITokenDataService tokenDataService, IDriveService driveService, IUserAuth userAuth, IOrganizationService organizationService)
	{
		_tokenDataService = tokenDataService;
		_driveService = driveService;
		_userAuth = userAuth;
		_organizationService = organizationService;
	}
	
	public async Task<IActionResult> SerializeJson(object data)
	{
		string content = await Task.Run(() => JsonConvert.SerializeObject((data)));
		return Content(
			content,
			"application/json"
		);
	}

	public async Task<User> GetUser()
	{
		string? accessToken = await HttpContext.GetTokenAsync("access_token");
		string lunarId = _tokenDataService.ExtractLunarID(accessToken!);
		User? user = await _userAuth.GetAsync(lunarId);

		return user!;
	}

	public async Task<string> GetQueryString(string? organizationId)
	{
		if (organizationId == null)
		{
			string? accessToken = await HttpContext.GetTokenAsync("access_token");
			return _tokenDataService.ExtractLunarID(accessToken!);
		}
		
		return organizationId;
	}

	public async Task<Drive> GetDrive(string? organizationId)
	{
		string queryId = await GetQueryString(organizationId);
		Drive drive = await _driveService.GetDrive(queryId);;
		return drive;
	}

	public async Task SaveDrive(Drive drive, string? organizationId)
	{
		string queryId = await GetQueryString(organizationId);
		await _driveService.SaveDrive(queryId, drive);
	}

	public async Task SaveUser(User user)
	{
		string? accessToken = await HttpContext.GetTokenAsync("access_token");
		string lunarId      = _tokenDataService.ExtractLunarID(accessToken!);

		await _userAuth.UpdateAsync(lunarId, user);
	}

	public async Task SaveOrganization(Organization organization, string organizationId)
	{
		
	}

	public async Task<ProjectResp> GetProject(string? organization_id, string project_id)
	{	
		APIStatusMsg status = new APIStatusMsg();
		status.MSG 			= "Endpoint working";
		status.Error		= false;

		Drive drive     = await GetDrive(organization_id);
		Project project = new Project();
		bool rootProj   = false;

		for(int i = 0; i < drive.Projects!.Count; i++)
		{
			Project _project = drive.Projects[i];

			if(_project.ProjectID == project_id)
			{
				project  = _project;
				rootProj = true;
			}
		}

		if(rootProj == false)
			project = _GetProject(drive.Folders!, project_id);

		ProjectResp resp = new ProjectResp();
		resp.Status      = status;
		resp.Project     = project;
		return resp;
	}

	public Project _GetProject(List<Folder> folders, string project_id)
	{
		Project project = new Project();
		for(int i = 0; i < folders.Count; i++)
		{
			Folder folder          = folders[i];
			List<Project> projects = folder.Projects!;

			for(int x = 0; x < projects.Count; x++)
			{
				Project _project = projects[x];
				if(_project.ProjectID! == project_id)
					project = _project;
				else
					project = _GetProject(folder.Folders!, project_id);
			}
		}

		return project;
	}
}