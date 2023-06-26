using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;
using SigmyzeServer.Services.OrganizationServices;
using Microsoft.AspNetCore.Authentication;
using SigmyzeServer.Services.DatasetShared;
using SigmyzeServer.Services.DatabaseServices;

namespace SigmyzeServer.Controllers;

[ApiController]
[Authorize]
[Route("/api/v{version:apiVersion}/quanta")]
[ApiVersion("2.0")]
public partial class QuantaController : OrganizationControllerBase
{
    private readonly IProjectRepository _projectRepository;
    private readonly IQuantaRepository _quantaRepository;
    private readonly IQuantaIndicatorRepository _quantaIndicatorRepository;
    private readonly IUserServiceRepository _userServiceRepository;
    private readonly IDriveRepository _driveRepository; 
    private readonly DatasetShared _sharedDataset;
    
    public QuantaController(
        IOrganizationRepository organizationRepository,
        IProjectRepository projectRepository,
        IQuantaRepository quantaRepository,
        IQuantaIndicatorRepository quantaIndicatorRepository,
        IUserServiceRepository userServiceRepository,
        IDriveRepository driveRepository,
        IQuantaDatasetService _quantaDatasetService
    ) : base(organizationRepository)
    {
        _projectRepository = projectRepository;
        _quantaRepository = quantaRepository;
        _quantaIndicatorRepository = quantaIndicatorRepository;
        _userServiceRepository = userServiceRepository;
        _driveRepository = driveRepository;

        _sharedDataset = new DatasetShared(_quantaDatasetService, _quantaIndicatorRepository, quantaRepository);
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

    [HttpGet("{organizationId}/{projectId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetQuantaProject(string organizationId, string projectId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "retreived";

        GetQuantaProjectResp resp = new GetQuantaProjectResp();
        resp.Status = msg;

        GetProjectDataQuery? project = await _quantaRepository.GetProjectData(projectId);
        if(project == null)
        {
            msg.Error = true;
            msg.MSG = "bad_project";
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        QuantaRepositoryDefinition phantomRepository = new QuantaRepositoryDefinition();
        phantomRepository.ProjectId = project.ProjectId;
        phantomRepository.ProjectName = project.ProjectName;
        phantomRepository.ProjectData = project.ProjectData;

        resp.ProjectData = phantomRepository;
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
}