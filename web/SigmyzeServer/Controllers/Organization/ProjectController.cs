using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/v{version:apiVersion}/projects")]
    [ApiVersion("2.0")]
    public class ProjectController : OrganizationControllerBase
    {
        private readonly IUserServiceRepository _userServiceRepository;
        private readonly IDriveRepository _driveRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly IQuantaRepository _quantaRepository;

        public ProjectController(
            IOrganizationRepository organizationRepository, 
            IUserServiceRepository userServiceRepository,
            IDriveRepository driveRepository,
            IProjectRepository projectRepository,
            IQuantaRepository quantaRepository
        ) : base(organizationRepository)
        {
            _userServiceRepository = userServiceRepository;
            _driveRepository = driveRepository;
            _projectRepository = projectRepository;
            _quantaRepository = quantaRepository;
        }

        //FEATURE: This retreives a drive from the collection chain
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
        public async Task<IActionResult> GetProject(string organizationId, string projectId) 
        {
            APIStatusMsg msg = new APIStatusMsg();
            msg.Error = false;
            msg.MSG = "retrieved";

            GetProjectResp resp = new GetProjectResp();
            resp.Status = msg;

            string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
            string lunarId = GetLunarID(accessToken);
            //NOTE: This error occurs when there is an error with thje body config
            //If this error occurs, double check your props whether it is a valid organization id or not
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

            //NOTE: Grab the project from the database
            ProjectData? project = await _projectRepository.GetProject(projectId);
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
            [FromBody]UpdateProjectDataBody body
        )
        {
            APIStatusMsg msg = new APIStatusMsg();
            msg.Error = false;
            msg.MSG = "updated";

            string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
            string lunarId = GetLunarID(accessToken);
            //NOTE: This error occurs when there is an error with thje body config
            //If this error occurs, double check your props whether it is a valid organization id or not
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

            //NOTE: Grab the project from the database
            ProjectData? project = await _projectRepository.GetProject(projectId);
            if(project == null)
            {
                msg.Error = true;
                msg.MSG = "bad_project";
                return await SerializeJSON(msg);
            }

            project.Documents = body.Data.Documents;
            project.Nodes = body.Data.Nodes;
            await _projectRepository.UpdateProject(project.ProjectId!, project);

            return await SerializeJSON(msg);
        }
    }
}