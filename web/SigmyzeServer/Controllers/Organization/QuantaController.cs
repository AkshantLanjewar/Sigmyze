using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Controllers;

[ApiController]
[Authorize]
[Route("/api/v{version:apiVersion}/quanta")]
[ApiVersion("2.0")]
public class QuantaController : OrganizationControllerBase
{
    private readonly IProjectRepository _projectRepository;
    private readonly IQuantaRepository _quantaRepository;
    private readonly IUserServiceRepository _userServiceRepository;
    private readonly IDriveRepository _driveRepository;
    public QuantaController(
        IOrganizationRepository organizationRepository,
        IProjectRepository projectRepository,
        IQuantaRepository quantaRepository,
        IUserServiceRepository userServiceRepository,
        IDriveRepository driveRepository
    ) : base(organizationRepository)
    {
        _projectRepository = projectRepository;
        _quantaRepository = quantaRepository;
        _userServiceRepository = userServiceRepository;
        _driveRepository = driveRepository;
    }

    private async Task<Drive?> GetDrive(string lunarId, string organizationId)
    {
        UserServiceIndex? userServicesIndex = await _userServiceRepository.GetUserService(lunarId);
        if(userServicesIndex == null)
            return null;
        Organization? organization = await ValidateOrganization(userServicesIndex, organizationId);
        if(organization == null)
            return null;

        string driveId = organization.LinkedDriveId!;
        Drive? drive = await _driveRepository.GetDrive(driveId);
        return drive;
    }

    [HttpGet("{organizationId}/{quantaId}/indicators")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicators(string organizationId, string quantaId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "retreived";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
        string lunarId = GetLunarID(accessToken);

        Drive? drive = await GetDrive(lunarId, organizationId);
        if(drive == null)
        {
            status.Error = true;
            status.MSG = "bad_config";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        DriveUtils utils = new DriveUtils(_projectRepository, _quantaRepository);
        if(utils.ValidateProject(drive, quantaId) == false)
        {
            status.Error = true;
            status.MSG = "invalid_project";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        QuantaRepositoryDefinition? project = await _quantaRepository.GetProject(quantaId);
        List<QuantaIndicator>? projectIndicators = project?.ProjectIndicators;
        if(projectIndicators == null)
        {
            status.Error = true;
            status.MSG = "no_indicators";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        List<QuantaIndicator> nIndicators = new List<QuantaIndicator>();
        int count = 0;
        while(count < projectIndicators.Count && count < 25)
        {
            nIndicators.Add(projectIndicators[count]);
            count++;
        }
        
        resp.Status = status;
        resp.Indicators = nIndicators;
        return await SerializeJSON(resp);
    }

    [HttpPost("add_indicator")]
    [MapToApiVersion("2.0")]
    [AllowAnonymous]
    public async Task<IActionResult> AddIndicator([FromBody]AddQuantaIndicator body)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "added indicators";

        if(body.ProcessId == null || body.OrganizationId == null || body.QuantaId == null || body.Indicators == null)
        {
            status.Error = true;
            status.MSG = "missing_params";
            return await SerializeJSON(status);
        }

        QuantaProjectCacheId? cache = await _quantaRepository.GetQuantaProjectCache(body.QuantaId, body.ProcessId);
        if(cache == null || cache.OrganizationId != body.OrganizationId)
        {
            status.Error = true;
            status.MSG = "invalid_cache";
            return await SerializeJSON(status);
        }

        List<QuantaIndicator> newIndicators = new List<QuantaIndicator>();
        List<string> indicators = body.Indicators;
        for(int i = 0; i < indicators.Count; i++)
        {
            string raw_indicator = indicators[i];
            QuantaIndicator? indicator = JsonConvert.DeserializeObject<QuantaIndicator>(raw_indicator);
            if(indicator == null || indicator.ChartData == null || indicator.Field == null)
                continue;

            newIndicators.Add(indicator);
        }

        //retreive and update the quanta project
        QuantaRepositoryDefinition? project = await _quantaRepository.GetProject(body.QuantaId);
        if(project == null)
        {
            status.Error = true;
            status.MSG = "invalid_project";
            return await SerializeJSON(status);
        }

        project.ProjectIndicators = newIndicators;
        await _quantaRepository.UpdateProject(body.QuantaId, project);
        return await SerializeJSON(status);
    }

    [HttpGet("{organizationId}/{projectId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetQuantaProject(string organizationId, string projectId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "retreived";

        GetQuantaProjectResp resp = new GetQuantaProjectResp();
        resp.Status = msg;

        string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
        string lunarId = GetLunarID(accessToken);

        Drive? drive = await GetDrive(lunarId, organizationId);
        if(drive == null)
        {
            msg.Error = true;
            msg.MSG = "bad_config";
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        DriveUtils utils = new DriveUtils(_projectRepository, _quantaRepository);
        if(utils.ValidateProject(drive, projectId) == false)
        {
            msg.Error = true;
            msg.MSG = "invalid_project";
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        QuantaRepositoryDefinition? project = await _quantaRepository.GetProject(projectId);
        if(project == null)
        {
            msg.Error = true;
            msg.MSG = "bad_project";
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        resp.ProjectData = project;
        return await SerializeJSON(resp);
    }

    [HttpGet("{organizationId}/{projectId}/cache/create/{processId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> BuildExecutionCache(string organizationId, string projectId, string processId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "cache_created";

        string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
        string lunarId = GetLunarID(accessToken);
        Drive? drive = await GetDrive(lunarId, organizationId);

        if(drive == null)
        {
            status.Error = true;
            status.MSG = "invalid organization id";
            return await SerializeJSON(status);
        }

        //create cache object
        await _quantaRepository.CreateQuantaProjectCache(organizationId, projectId, processId);
        return await SerializeJSON(status);
    }

    [HttpGet("{organizationId}/{projectId}/cache/delete/{processId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> DeleteExecutionCache(string organizationId, string projectId, string processId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "cache_removed";

        string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
        string lunarId = GetLunarID(accessToken);
        Drive? drive = await GetDrive(lunarId, organizationId);

        if(drive == null)
        {
            status.Error = true;
            status.MSG = "invalid organization id";
            return await SerializeJSON(status);
        }

        await _quantaRepository.DeleteQuantaProjectCache(projectId, processId);
        return await SerializeJSON(status);
    }

    [HttpPost("{organizationId}/{projectId}")]
    public async Task<IActionResult> UpdateProject(
        string organizationId, 
        string projectId,
        [FromBody]UpdateQuantaDataBody body
    )
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "updated";

        if(body.Data == null)
        {
            msg.Error = true;
            msg.MSG = "bad_param";
            return await SerializeJSON(msg);
        }

        string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
        string lunarId = GetLunarID(accessToken);
        Drive? drive = await GetDrive(lunarId, organizationId);
        if(drive == null)
        {
            msg.Error = true;
            msg.MSG = "bad_config";
            return await SerializeJSON(msg);
        }

        DriveUtils utils = new DriveUtils(_projectRepository, _quantaRepository);
        if(utils.ValidateProject(drive, projectId) == false)
        {
            msg.Error = true;
            msg.MSG = "invalid_project";
            return await SerializeJSON(msg);
        }

        QuantaRepositoryDefinition? project = await _quantaRepository.GetProject(projectId);
        if(project == null)
        {
            msg.Error = true;
            msg.MSG = "bad_project";
            return await SerializeJSON(msg);
        }

        project.ProjectData = body.Data;

        await _quantaRepository.UpdateProject(project.ProjectId!, project);
        return await SerializeJSON(msg);
    }
}