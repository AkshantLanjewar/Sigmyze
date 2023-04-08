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