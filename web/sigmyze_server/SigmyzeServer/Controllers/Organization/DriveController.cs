using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Services.OrganizationServices;
using SigmyzeServer.Services.Web.Lunar;

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
        private readonly IQuantaRepository _quantaRepository;
        private readonly ILunarRefreshService _lunarRefreshService;

        public DriveController(
            IOrganizationRepository organizationRepository, 
            IUserServiceRepository userServiceRepository,
            IDriveRepository driveRepository,
            IProjectRepository projectRepository,
            IQuantaRepository quantaRepository,
            ILunarRefreshService lunarRefreshService
        ) : base(organizationRepository)
        {
            _userServiceRepository = userServiceRepository;
            _driveRepository = driveRepository;
            _projectRepository = projectRepository;
            _quantaRepository = quantaRepository;
            _lunarRefreshService = lunarRefreshService;
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
                return await SerializeJSON(msg);
            }

            DriveUtils utils = new DriveUtils(_projectRepository, _quantaRepository);
            drive = utils.InsertFolder(drive!, body.ParentFolder, body.FolderName);
            await _driveRepository.UpdateDrive(drive.DriveId!, drive);

            return await SerializeJSON(msg);
        }
    
        //FEATURE: This deletes a folder and all its recursive children
        [HttpPost("delete-folder")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> DeleteFolder([FromBody]DeleteFolderBody body)
        {
            APIStatusMsg msg = new APIStatusMsg();
            msg.Error = false;
            msg.MSG = "folder-deleted";
            
            if(body.OrganizationId == null || body.FolderId == null || body.ParentFolder == null)
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
                return await SerializeJSON(msg);
            }

            DriveUtils utils = new DriveUtils(_projectRepository, _quantaRepository);
            drive = utils.DeleteFolder(drive!, body.ParentFolder, body.FolderId);
            await _driveRepository.UpdateDrive(drive.DriveId!, drive);

            return await SerializeJSON(msg);
        }

        [HttpPost("update-folder")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> UpdateFolder([FromBody]UpdateFolderBody body)
        {
            APIStatusMsg msg = new APIStatusMsg();
            msg.Error = false;
            msg.MSG = "folder-updated";

            if(body.OrganizationId == null || body.FolderId == null || body.ParentFolder == null)
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
                return await SerializeJSON(msg);
            }

            DriveUtils utils = new DriveUtils(_projectRepository, _quantaRepository);
            drive = utils.UpdateFolder(drive!, body.ParentFolder, body.FolderId, body.FolderName);
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

            if(body.OrganizationId == null || body.ProjectName == null || body.ParentFolder == null || body.ProjectType == null)
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
                return await SerializeJSON(msg);
            }

            DriveUtils utils = new DriveUtils(_projectRepository, _quantaRepository, _lunarRefreshService);
            drive = await utils.InsertProject(drive!, body.OrganizationId, body.ParentFolder, body.ProjectName, body.ProjectType);
            await _driveRepository.UpdateDrive(drive.DriveId!, drive);

            return await SerializeJSON(msg);
        }

        [HttpPost("delete-project")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> DeleteProject([FromBody]DeleteProjectBody body)
        {
            APIStatusMsg msg = new APIStatusMsg();
            msg.Error = false;
            msg.MSG = "delete_project";

            if(body.OrganizationId == null || body.ProjectId == null || body.ParentFolder == null || body.ProjectType == null)
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
                return await SerializeJSON(msg);
            }

            DriveUtils utils = new DriveUtils(_projectRepository, _quantaRepository);
            drive = utils.DeleteProject(drive!, body.ParentFolder, body.ProjectId, body.OrganizationId, body.ProjectType);
            await _driveRepository.UpdateDrive(drive.DriveId!, drive);

            return await SerializeJSON(msg);
        }
    
        [HttpPost("update-project")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> UpdateProject([FromBody]UpdateProjectBody body)
        {
            APIStatusMsg msg = new APIStatusMsg();
            msg.Error = false;
            msg.MSG = "project-updated";

            if(body.OrganizationId == null || body.ProjectId == null || body.ParentFolder == null || body.ProjectType == null)
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
                return await SerializeJSON(msg);
            }

            DriveUtils utils = new DriveUtils(_projectRepository, _quantaRepository);
            drive = await utils.UpdateProject(drive!, body.ParentFolder, body.ProjectId, body.ProjectName, body.ProjectType);
            await _driveRepository.UpdateDrive(drive.DriveId!, drive);

            return await SerializeJSON(msg);
        }
    }
}