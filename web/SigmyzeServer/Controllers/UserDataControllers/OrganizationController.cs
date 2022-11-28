using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Organizations;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.UserData;
using SigmyzeServer.Models.Polis;
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
	private readonly IPolisService _polisService;
	private bool checkFlag;

	public OrganizationController
		(ITokenDataService tokenDataService, IPolisService polisService,
			IDriveService driveService, IUserAuth userAuth, IOrganizationService organizationService) 
		: base(tokenDataService, driveService, userAuth, organizationService)
	{

		_organizationService = organizationService;
		_polisService		 = polisService;

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

			Organization? cOrg = await checkPolis(organization);
			if(cOrg != null)
				organization = cOrg;

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

		string lunarId 			   = await GetQueryString(null);
		Organization? organization = await _organizationService.GetOrganization(organizationId);
		if (organization == null)
		{
			status.Error = true;
			status.MSG = "Organization does not exist";
			response.Status = status;

			return await SerializeJson(status);
		}
		
		Drive drive = await _driveService.GetDrive(organization.OrganizationDrive!);
		if(!organization.OrganizationUsers!.Contains(lunarId))
			organization.PublishedQueue = new List<Article>();

		response.Organization = organization;
		response.Drive = drive;
		return await SerializeJson(response);
	}

	[HttpGet("organization/{organizationId}/projects/{projectId}")]
	[MapToApiVersion("1.0")]
	public async Task<IActionResult> GetOrganizationProject(string organizationId, string projectId)
	{
		ProjectResp resp = await GetProject(organizationId, projectId);
		return await SerializeJson(resp);
	}

	[HttpPost("organization/{organizationId}/projects/{projectId}/publish")]
	[MapToApiVersion("1.0")]
	public async Task<IActionResult> PublishDocument([FromBody]Article article, string organizationId, string projectId)
	{
		APIStatusMsg resp = new APIStatusMsg();
		resp.Error  	  = false;
		resp.MSG	      = "document_published";

		Organization? organization = await _organizationService.GetOrganization(organizationId);
		if(organization == null)
		{
			resp.Error = true;
			resp.MSG   = "organization_dne";
			return await SerializeJson(resp);
		}

		//check if a user published document
		if(article.PublicUser!.LunarId == "user") 
		{
			string lunarId = await GetQueryString(null);
			article.PublicUser!.LunarId = lunarId;
		}

		article.PublishedId = Guid.NewGuid().ToString();
		if(organization.PublishedQueue == null)
			organization.PublishedQueue = new List<Article>();
		organization.PublishedQueue.Add(article);

		await _organizationService.SaveOrganization(organization, organizationId);
		return await SerializeJson(resp);
	}

	[HttpGet("organization/{organizationId}/deny/{publishedId}")]
	[MapToApiVersion("1.0")]
	public async Task<IActionResult> DenyArticle(string organizationId, string publishedId)
	{
		APIStatusMsg resp = new APIStatusMsg();
		resp.Error  	  = false;
		resp.MSG	      = "document_published";

		Organization? organization = await _organizationService.GetOrganization(organizationId);
		if(organization == null)
		{
			resp.Error = true;
			resp.MSG   = "organization_dne";
			return await SerializeJson(resp);
		}

		if(organization.PublishedQueue == null)
			organization.PublishedQueue = new List<Article>();
		List<Article> n_queue = new List<Article>();

		for(int i = 0; i < organization.PublishedQueue.Count; i++)
		{
			Article article = organization.PublishedQueue[i];
			if(article.PublishedId == publishedId || article.PublishedId == null)
				continue;

			n_queue.Add(article);
		}

		organization.PublishedQueue = n_queue;
		await _organizationService.SaveOrganization(organization, organizationId);
		return await SerializeJson(resp);
	}

	[HttpGet("organization/{organizationId}/delete/{publishedId}")]
	[MapToApiVersion("1.0")]
	public async Task<IActionResult> DeleteArticle(string organizationId, string publishedId)
	{
		APIStatusMsg resp = new APIStatusMsg();
		resp.Error  	  = false;
		resp.MSG	      = "article_deleted";

		Organization? organization = await _organizationService.GetOrganization(organizationId);
		List<Article> published    = new List<Article>();
		if(organization!.Published != null)
			published = organization.Published;

		List<Article> n_published = new List<Article>();
		for(int i = 0; i < published.Count; i++)
		{
			Article article = published[i];
			if(article.PublishedId == publishedId)
				continue;
			
			n_published.Add(article);
		}

		organization.Published = published;
		await _organizationService.SaveOrganization(organization, organizationId);
		return await SerializeJson(resp);
	}

	[HttpGet("organization/{organizationId}/approve/{publishedId}")]
	[MapToApiVersion("1.0")]
	public async Task<IActionResult> ApproveArticle(string organizationId, string publishedId)
	{
		APIStatusMsg resp = new APIStatusMsg();
		resp.Error  	  = false;
		resp.MSG	      = "document_approved";

		Organization? organization = await _organizationService.GetOrganization(organizationId);
		List<Article> n_queue      = new List<Article>();
		List<Article> published    = new List<Article>();

		if(organization!.Published != null)
			published = organization.Published;
		
		for(int i = 0; i < organization.PublishedQueue!.Count; i++)
		{
			Article article = organization.PublishedQueue[i];
			if(article.PublishedId == publishedId)
			{
				published.Add(article);
				continue;
			}

			n_queue.Add(article);
		}

		organization.Published 		= published;
		organization.PublishedQueue = n_queue;
		await _organizationService.SaveOrganization(organization, organizationId);
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

	private async Task<Organization?> checkPolis(Organization organization)
	{
		if(organization.HasPage == false || organization.PolisId != null)
			return null;

		//create polis
		Polis polis = new Polis();
		polis.PolisId 		 = organization.OrganizationId;
		polis.OrganizationId = organization.OrganizationId;

		//polis data
		PolisData data = new PolisData();
		data.Articles  = new List<Article>();
		if(organization.Published != null)
			data.Articles = organization.Published;
		
		//polis layout
		Layout layout   = new Layout();
		layout.LayoutId = "blog";
		layout.Panes    = defaultLayout();

		polis.ActiveLayout = layout;
		polis.Data		   = data;

		organization.PolisId = polis.PolisId;

		await _organizationService.SaveOrganization(organization, organization.OrganizationId!);
		await _polisService.CreatePolis(polis);
		return organization;
	}

	private List<LayoutPane> defaultLayout()
	{
		List<LayoutPane> layout = new List<LayoutPane>();

		LayoutPane _blogHeader = new LayoutPane();
		_blogHeader.PaneId	   = "blog-header";
		_blogHeader.Title	   = "Sigmyze News Feed";

		LayoutPane _mainArticle = new LayoutPane();
		_mainArticle.PaneId		= "main-article";

		LayoutPane _articleBlock = new LayoutPane();
		_articleBlock.PaneId     = "article-block";

		layout.Add(_blogHeader);
		layout.Add(_mainArticle);
		layout.Add(_articleBlock);

		return layout;
	}
}