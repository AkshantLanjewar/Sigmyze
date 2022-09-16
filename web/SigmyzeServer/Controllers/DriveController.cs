using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.UserData;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using SigmyzeServer.Services;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/drive")]
    [ApiVersion("1.0")]
    public class DriveController : ControllerBase
    {
        private readonly ITokenDataService _tokenDataService;
        private readonly IDriveService _driveService;

        public DriveController(ITokenDataService tokenDataService, IDriveService driveService)
        {
            _tokenDataService = tokenDataService;
            _driveService     = driveService;
        }

        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> DriveRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "Drive Working";

            Drive drive = await GetDrive();

            DriveResp resp = new DriveResp();
            resp.Status    = status;
            resp.Drive     = drive;

            return await SerializeJSON(resp);
        }

        [HttpPost("create-folder")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> CreateFolder([FromBody]CreateFolder req)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "folder created";

            Drive drive         = await GetDrive();
            Folder _nFolder     = new Folder();
            _nFolder.FolderID   = Guid.NewGuid().ToString();
            _nFolder.FolderName = req.folder_name;
            _nFolder.Folders    = new List<Folder>();
            _nFolder.Projects   = new List<Project>();

            if(req.directory == "root")
                drive.Folders!.Append(_nFolder);
            else
                drive.Folders = _InsertFolder(drive.Folders!, _nFolder, req.directory!);

            DriveResp resp = new DriveResp();
            resp.Status    = status;
            resp.Drive     = drive;

            return await SerializeJSON(resp);
        }

        [HttpPost("create-project")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> CreateProject([FromBody]CreateProject req)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "project created";

            Drive drive           = await GetDrive();
            Project _nProject     = new Project();
            _nProject.ProjectID   = Guid.NewGuid().ToString();
            _nProject.ProjectName = req.project_name;
            _nProject.ProjectType = req.project_type;
            
            _nProject.ProjectData            = new ProjectData();
            _nProject.ProjectData.Documents  = new List<Document>();
            _nProject.ProjectData.Indicators = new List<Models.Data.DatasetIndicator>();

            return await SerializeJSON(status);
        }

        private List<Folder> _InsertFolder(List<Folder> directory, Folder _nFolder, string directory_id)
        {
            List<Folder> _nDirectory = directory;
            for(int i = 0; i < _nDirectory.Count; i++)
            {
                Folder _folder = _nDirectory[i];
                if(_folder.FolderID == directory_id)
                    _folder.Folders!.Append(_nFolder);
                if(_folder.Folders!.Count > 0)
                    _folder.Folders = _InsertFolder(_folder.Folders, _nFolder, directory_id);
                _nDirectory[i] = _folder;
            }

            return _nDirectory;
        }

        private async Task<Drive> GetDrive()
        {
            string? access_token = await HttpContext.GetTokenAsync("access_token");
            string lunar_id      = _tokenDataService.ExtractLunarID(access_token!);
            Drive drive          = await _driveService.GetDrive(lunar_id);

            return drive;
        }

        private async Task<IActionResult> SerializeJSON(object data)
        {
            string content = await Task.Run(() => JsonConvert.SerializeObject(data));
            return Content(
                content,
                "application/json"
            );
        }
    }
}