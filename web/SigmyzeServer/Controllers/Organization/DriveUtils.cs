using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Controllers;

public class DriveUtils
{
    private readonly IProjectRepository _projectRepository;
    private readonly IQuantaRepository _quantaRepository;

    public DriveUtils(IProjectRepository projectRepository, IQuantaRepository quantaRepository)
    {
        _projectRepository = projectRepository;
        _quantaRepository = quantaRepository;
    }

    private List<ProjectView> getProjects(List<ProjectView> projects, List<Folder> folders) 
    {
        List<ProjectView> nProjects = projects;
        for(int i = 0; i < folders.Count; i++) {
            Folder folder = folders[i];
            for(int x = 0; x < folder.Projects!.Count; x++)
                nProjects.Add(folder.Projects![x]);

            nProjects = getProjects(nProjects, folder.Folders!);
        }

        return nProjects;
    }

    private async Task deleteFolderProjects(Folder folder)
    {
        List<ProjectView> projects = new List<ProjectView>();
        for(int i = 0; i < folder.Projects!.Count; i++)
            projects.Add(folder.Projects![i]);

        projects = getProjects(projects, folder.Folders!);
        for(int i = 0; i < projects.Count; i++)
        {
            ProjectView project = projects[i];
            await _projectRepository.DeleteProject(project.ProjectId!);
        }
    }

    private List<Folder> _editParentFolders(List<Folder> folders, string method, Folder requestedFolder)
    {
        List<Folder> nFolders = new List<Folder>();
        
        if(method == "insert")
        {
            nFolders = folders;
            nFolders.Add(requestedFolder);
        }

        if(method == "delete")
        {
            for(int i = 0; i < folders.Count; i++)
            {
                Folder folder = folders[i];
                if(requestedFolder.FolderId == folder.FolderId)
                {
                    Task.Run(async () => await deleteFolderProjects(folder));
                    continue;
                }

                nFolders.Add(folder);
            }
        }

        if(method == "update")
        {
            for(int i = 0; i < folders.Count; i++)
            {
                Folder folder = folders[i];
                if(requestedFolder.FolderId == folder.FolderId && requestedFolder.FolderName != null)
                    folder.FolderName = requestedFolder.FolderName;

                nFolders.Add(folder);
            }
        }

        return nFolders;
    }

    private List<ProjectView> _editProjectList(List<ProjectView> projects, string method, ProjectView requestedProject)
    {
        List<ProjectView> nProjects = new List<ProjectView>();
        if(method == "insert")
        {
            nProjects = projects;
            nProjects.Add(requestedProject);
        }

        if(method == "delete")
        {
            for(int i = 0; i < projects.Count; i++)
            {
                ProjectView project = projects[i];
                if(project.ProjectId == requestedProject.ProjectId)
                {
                    Task.Run(async () => await _projectRepository.DeleteProject(project.ProjectId!));
                    continue;
                }

                nProjects.Add(project);
            }
        }

        if(method == "update")
        {
            for(int i = 0; i < projects.Count; i++)
            {
                ProjectView project = projects[i];
                if(project.ProjectId == requestedProject.ProjectId && requestedProject.ProjectName != null)
                    project.ProjectName = requestedProject.ProjectName;

                nProjects.Add(project);
            }
        }

        return nProjects;
    }

    private List<Folder> _editFolder(List<Folder> folders, string parentFolder, string method, Folder requestedFolder)
    {
        List<Folder> nFolders = new List<Folder>();
        for(int i = 0; i < folders.Count; i++)
        {
            Folder folder = folders[i];
            if(folder.FolderId == parentFolder)
                folder.Folders = _editParentFolders(folder.Folders!, method, requestedFolder);
            else
                folder.Folders = _editFolder(folder.Folders!, parentFolder, method, requestedFolder);

            nFolders.Add(folder);
        }

        return nFolders;
    }

    private List<Folder> _editProject(List<Folder> folders, string parentFolder, string method, ProjectView requestedProject)
    {
        List<Folder> nFolders = new List<Folder>();
        for(int i = 0; i < folders.Count; i++)
        {
            Folder folder = folders[i];
            if(folder.FolderId == parentFolder)
                folder.Projects = _editProjectList(folder.Projects!, method, requestedProject);
            else
                folder.Folders = _editProject(folder.Folders!, parentFolder, method, requestedProject);
                
            nFolders.Add(folder);
        }

        return nFolders;
    }

    public Drive InsertFolder(Drive drive, string parentFolder, string folderName)
    {
        Folder n_folder = new Folder();
        n_folder.FolderId = Guid.NewGuid().ToString();
        n_folder.FolderName = folderName;
        n_folder.Folders = new List<Folder>();
        n_folder.Projects = new List<ProjectView>();

        Drive nDrive = drive;
        if(parentFolder == "root")
            nDrive.Folders = _editParentFolders(nDrive.Folders!, "insert", n_folder);
        else
            nDrive.Folders = _editFolder(nDrive.Folders!, parentFolder, "insert", n_folder);

        return nDrive;
    }

    public Drive DeleteFolder(Drive drive, string parentId, string folderId)
    {
        Folder reqFolder = new Folder();
        reqFolder.FolderId = folderId;

        Drive nDrive = drive;
        if(parentId == "root")
            nDrive.Folders = _editParentFolders(nDrive.Folders!, "delete", reqFolder);
        else
            nDrive.Folders = _editFolder(nDrive.Folders!, parentId, "delete", reqFolder);

        return nDrive;
    }

    public Drive UpdateFolder(Drive drive, string parentId, string folderId, string? folderName)
    {
        Folder reqFolder = new Folder();
        reqFolder.FolderId = folderId;
        reqFolder.FolderName = folderName;

        Drive nDrive = drive;
        if(parentId == "root")
            nDrive.Folders = _editParentFolders(nDrive.Folders!, "update", reqFolder);
        else
            nDrive.Folders = _editFolder(nDrive.Folders!, parentId, "update", reqFolder);

        return nDrive;
    }

    public async Task<Drive> InsertProject(
        Drive drive, 
        string organizationId, 
        string parentFolder, 
        string projectName,
        string projectType
    )
    {
        ProjectView projectView = new ProjectView();
        projectView.ProjectId = Guid.NewGuid().ToString();
        projectView.ProjectName = projectName;
        projectView.ProjectType = projectType;

        if(projectType == "lunar_project")
        {
            //Build the database version
            ProjectData projectDB = new ProjectData();
            projectDB.ProjectId = projectView.ProjectId;
            projectDB.ProjectName = projectView.ProjectName;
            projectDB.OrganizationId = organizationId;
            projectDB.Documents = new List<Document>();
            projectDB.Nodes = new List<Node>();

            //build the default split
            Node defaultSplit = new Node();
            defaultSplit.NodeId = "project_split";
            defaultSplit.NodeName = "Project";
            defaultSplit.NodeType = "project";
            defaultSplit.Data = new NodeData();
            defaultSplit.Children = new List<Node>();

            //build the default demo chart
            Node demoChart = new Node();
            demoChart.NodeId = "demo-chart";
            demoChart.NodeName = "Demo Chart";
            demoChart.NodeType = "chart";
            demoChart.Children = new List<Node>();
            demoChart.Data = new NodeData();
            demoChart.Data.Indicators = new List<IIndicator>();

            //append them together
            defaultSplit.Children.Add(demoChart);
            projectDB.Nodes.Add(defaultSplit);
            await _projectRepository.CreateProject(projectDB);
        }

        if(projectType == "quanta_project")
            await _quantaRepository.InitQuantaProject(projectView.ProjectId, projectView.ProjectName, organizationId);

        //Update the drive now
        Drive nDrive = drive;
        if(parentFolder == "root")
            nDrive.Projects!.Add(projectView);
        else
            nDrive.Folders = _editProject(nDrive.Folders!, parentFolder, "insert", projectView);

        return nDrive;
    }

    private bool validateProject(List<Folder> folders, string projectId)
    {
        for(int i = 0; i < folders.Count; i++)
        {
            Folder folder = folders[i];
            List<ProjectView> projects = folder.Projects!;

            for(int x = 0; x < projects.Count; x++)
            {
                ProjectView project = projects[i];
                if(project.ProjectId == projectId)
                    return true;
            }

            bool resp = validateProject(folder.Folders!, projectId);
            if(resp == true)
                return true;
        }

        return false;
    }
    
    public bool ValidateProject(Drive drive, string projectId)
    {
        for(int i = 0; i < drive.Projects!.Count; i++)
        {
            ProjectView project = drive.Projects![i];
            if(project.ProjectId == projectId)
                return true;
        }

        return validateProject(drive.Folders!, projectId);
    }
    
    public Drive DeleteProject(Drive drive, string parentId, string projectId, string projectType)
    {
        ProjectView view = new ProjectView();
        view.ProjectId = projectId;

        //delete the project based on the type
        if(projectType == "lunar_project")
            Task.Run(async () => await _projectRepository.DeleteProject(projectId));
        if(projectType == "quanta_project")
            Task.Run(async () => await _quantaRepository.DeleteProject(projectId));

        Drive nDrive = drive;
        if(parentId == "root")
            nDrive.Projects = _editProjectList(nDrive.Projects!, "delete", view);
        else
            nDrive.Folders = _editProject(nDrive.Folders!, parentId, "delete", view);

        return nDrive;
    }

    public async Task<Drive> UpdateProject(Drive drive, string parentId, string projectId, string? name, string? projectType)
    {
        ProjectView view = new ProjectView();
        view.ProjectId = projectId;
        view.ProjectName = name;
        view.ProjectType = projectType;
        
        ProjectData projectDb = (await _projectRepository.GetProject(projectId))!;
        if(view.ProjectName != null)
            projectDb.ProjectName = view.ProjectName;
            
        await _projectRepository.UpdateProject(projectId, projectDb);
        Drive nDrive = drive;
        if(parentId == "root")
            nDrive.Projects = _editProjectList(nDrive.Projects!, "update", view);
        else
            nDrive.Folders = _editProject(nDrive.Folders!, parentId, "update", view);

        return nDrive;
    }
}