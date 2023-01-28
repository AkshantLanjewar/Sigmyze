using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Controllers
{
    //FEATURE: This endpoint involved CRUD with the organization's drive
    [ApiController]
    [Authorize]
    [Route("/api/v{version:apiVersion}/drive")]
    [ApiVersion("2.0")]
    public class DriveController : OrganizationControllerBase
    {
        private readonly IUserServiceRepository _userServiceRepository;
        private readonly IDriveRepository _driveRepository;
        private readonly IProjectRepository _projectRepository; 

        public DriveController(
            IOrganizationRepository organizationRepository, 
            IUserServiceRepository userServiceRepository,
            IDriveRepository driveRepository,
            IProjectRepository projectRepository
        ) : base(organizationRepository)
        {
            _userServiceRepository = userServiceRepository;
            _driveRepository = driveRepository;
            _projectRepository = projectRepository;
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

        [HttpPost("create-folder")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> CreateFolder([FromBody]CreateFolderBody body)
        {
            APIStatusMsg msg = new APIStatusMsg();
            msg.MSG = "created folder";
            msg.Error = false;

            if(body.OrganizationId == null || body.FolderName == null || body.ParentFolder == null)
            {
                msg.MSG = "bad_req";
                msg.Error = true;
                return await SerializeJSON(msg);
            }

            string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
            string lunarId = GetLunarID(accessToken);
            //NOTE: This error occurs when there is an error with thje body config
            //If this error occurs, double check your props whether it is a valid organization id or not
            Drive? drive = await GetDrive(lunarId, body.OrganizationId);
            if(drive == null)
            {
                msg.Error = true;
                msg.MSG = "bad_config";
            }

            DriveUtils utils = new DriveUtils();
            drive = utils.InsertFolder(drive!, body.ParentFolder, body.FolderName);
            await _driveRepository.UpdateDrive(drive.DriveId!, drive);

            return await SerializeJSON(msg);
        }
    
        [HttpPost("create-project")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> CreateProject([FromBody]CreateProjectBody body)
        {
            APIStatusMsg msg = new APIStatusMsg();
            msg.Error = false;
            msg.MSG = "new_project";

            if(body.OrganizationId == null || body.ProjectName == null || body.ParentFolder == null)
            {
                msg.MSG = "bad_req";
                msg.Error = true;
                return await SerializeJSON(msg);
            }

            string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
            string lunarId = GetLunarID(accessToken);
            //NOTE: This error occurs when there is an error with thje body config
            //If this error occurs, double check your props whether it is a valid organization id or not
            Drive? drive = await GetDrive(lunarId, body.OrganizationId);
            if(drive == null)
            {
                msg.Error = true;
                msg.MSG = "bad_config";
            }

            DriveUtils utils = new DriveUtils();
            drive = utils.InsertProject(_projectRepository, drive!, body.OrganizationId, body.ParentFolder, body.ProjectName);
            await _driveRepository.UpdateDrive(drive.DriveId!, drive);

            return await SerializeJSON(msg);
        }
    }
}