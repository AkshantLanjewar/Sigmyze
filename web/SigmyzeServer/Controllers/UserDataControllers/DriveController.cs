using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.UserData;
using SigmyzeServer.Services;
using SigmyzeServer.Services.Auth;
using SigmyzeServer.Services.DatabaseServices;

namespace SigmyzeServer.Controllers.UserDataControllers
{
    [ApiController]
    [Authorize]
    [Route("api/v{version:apiVersion}/drive")]
    [ApiVersion("1.0")]
    public class DriveController : DataControllerBase
    {
        private readonly ITokenDataService _tokenDataService;
        private readonly IDriveService _driveService;

        public DriveController(ITokenDataService tokenDataService, IDriveService driveService, IUserAuth userAuth) : base(tokenDataService, driveService, userAuth)
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

            return await SerializeJson(resp);
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

            if(req.directory!.Equals("root"))
                drive.Folders!.Add(_nFolder);
            else
                drive.Folders = _InsertFolder(drive.Folders!, _nFolder, req.directory!);

            DriveResp resp = new DriveResp();
            resp.Status    = status;
            resp.Drive     = drive;

            await SaveDrive(drive);
            return await SerializeJson(resp);
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
            _nProject.ProjectData.Indicators = new List<ProjectIndicator>();

            if(req.directory == "root")
                drive.Projects!.Add(_nProject);
            else
                drive.Folders = _EditProject(drive.Folders!, _nProject, req.directory!);
            
            await SaveDrive(drive);

            return await SerializeJson(status);
        }

        [HttpPost("update-project")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> UpdateProject([FromBody]UpdateProject req)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "project saved";

            Drive drive = await GetDrive();
            
            if(req.directory! == "root")
            {
                for(int i = 0; i < drive.Projects!.Count; i++)
                    if(drive.Projects[i].ProjectID! == req.project_id)
                        drive.Projects[i] = req.project!;
            }
            else
            {
                drive.Folders = _EditProject(drive.Folders!, req.project!, req.directory!, "update");
            }

            await SaveDrive(drive);
            return await SerializeJson(status);
        }

        [HttpPost("update-folder")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> UpdateFolder([FromBody]UpdateFolder req)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "folder saved";

            Drive drive = await GetDrive();

            if(req.directory! == "root")
            {
                for(int i = 0; i < drive.Folders!.Count; i++)
                    if(drive.Folders[i].FolderID == req.folder_id)
                        drive.Folders[i] = req.folder!;
            }
            else
            {
                drive.Folders = _UpdateFolder(drive.Folders!, req.folder!, req.directory!);
            }

            await SaveDrive(drive);
            return await SerializeJson(status);
        }

        [HttpPost("delete-project")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> DeleteProject([FromBody]DeleteProject req)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "project deleted";

            Drive drive         = await GetDrive();
            Project _sProject   = new Project();
            _sProject.ProjectID = req.project_id!;

            if(req.directory == "root")
                drive.Projects = _DeleteProject(drive.Projects!, req.project_id!);
            else
                drive.Folders = _EditProject(drive.Folders!, _sProject, req.directory!, "delete");

            await SaveDrive(drive);
            return await SerializeJson(status);
        }

        [HttpPost("delete-folder")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> DeleteFolder([FromBody]DeleteFolder req)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "folder deleted";

            Drive drive       = await GetDrive();
            Folder _sFolder   = new Folder();
            _sFolder.FolderID = req.directory_id;

            if(req.directory == "root")
                drive.Folders = _DeleteFolder(drive.Folders!, req.directory_id!);
            else
                drive.Folders = _InsertFolder(drive.Folders!, _sFolder, req.directory!, "delete");

            await SaveDrive(drive);
            return await SerializeJson(status);
        }

        [HttpGet("projects/{project_id}")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetProject(string project_id)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "got project";

            Drive drive     = await GetDrive();
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
            return await SerializeJson(resp);
        }

        private Project _GetProject(List<Folder> folders, string project_id)
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

        private List<Folder> _UpdateFolder(List<Folder> directory, Folder _nFolder, string directory_id)
        {
            List<Folder> _nDirectory = directory;
            for(int i = 0; i < _nDirectory.Count; i++)
            {
                Folder _folder = _nDirectory[i];
                if(_folder.FolderID == directory_id)
                {
                    for(int x = 0; x < _folder.Folders!.Count; x++)
                        if(_folder.Folders[x].FolderID == _nFolder.FolderID)
                            _folder.Folders[x] = _nFolder;
                }

                if(_folder.Folders!.Count > 0)
                    _folder.Folders = _UpdateFolder(_folder.Folders!, _nFolder, directory_id);
                _nDirectory[i] = _folder;
            }

            return _nDirectory;
        }

        private List<Folder> _InsertFolder(List<Folder> directory, Folder _nFolder, string directory_id, string mode = "append")
        {
            List<Folder> _nDirectory = directory;
            for(int i = 0; i < _nDirectory.Count; i++)
            {
                Folder _folder = _nDirectory[i];
                if(_folder.FolderID == directory_id)
                {
                    if(mode == "append")
                        _folder.Folders!.Add(_nFolder);
                    if(mode == "delete")
                        _folder.Folders = _DeleteFolder(_folder.Folders!, _nFolder.FolderID!);
                }    
                
                if(_folder.Folders!.Count > 0)
                    _folder.Folders = _InsertFolder(_folder.Folders, _nFolder, directory_id);
                _nDirectory[i] = _folder;
            }

            return _nDirectory;
        }

        private List<Folder> _EditProject(List<Folder> directory, Project _nProject, string directory_id, string mode = "append")
        {
            List<Folder> _nDirectory = directory;
            for(int i = 0; i < _nDirectory.Count; i++)
            {
                Folder _folder = _nDirectory[i];
                if(_folder.FolderID == directory_id)
                {
                    if(mode == "append")
                        _folder.Projects!.Add(_nProject);
                    if(mode == "delete")
                        _folder.Projects = _DeleteProject(_folder.Projects!, _nProject.ProjectID!);
                    if(mode == "update")
                    {
                        int project_index = 0;
                        for(int x = 0; x < _folder.Projects!.Count; i++)
                            if(_folder.Projects[i].ProjectID == _nProject.ProjectID)
                                project_index = x;
                        _folder.Projects![project_index] = _nProject;
                    }

                    break;
                } 
                else if (_folder.Folders!.Count > 0)
                {
                    _folder.Folders = _EditProject(_folder.Folders, _nProject, directory_id);
                }             

                _nDirectory[i] = _folder;   
            }

            return _nDirectory;
        }

        private List<Folder> _DeleteFolder(List<Folder> folders, string directory)
        {
            List<Folder> _folders = new List<Folder>();
            for(int i = 0; i < folders.Count; i++)
                if(folders[i].FolderID != directory)
                    _folders.Add(folders[i]);

            return _folders;
        }

        private List<Project> _DeleteProject(List<Project> projects, string project_id)
        {
            List<Project> _projects = new List<Project>();
            for(int i = 0; i < projects.Count; i++)
            {
                Project project = projects[i];
                if(project.ProjectID == project_id)
                    continue;

                _projects.Add(project);
            }

            return _projects;
        }
    }
}