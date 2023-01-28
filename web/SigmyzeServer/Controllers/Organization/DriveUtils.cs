using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Controllers;

public class DriveUtils
{
    public DriveUtils()
    {

    }

    private List<Folder> _editParentFolders(List<Folder> folders, string method, Folder requestedFolder)
    {
        List<Folder> nFolders = new List<Folder>();
        
        if(method == "insert")
        {
            nFolders = folders;
            nFolders.Add(requestedFolder);
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
            nDrive.Folders!.Add(n_folder);
        else
            nDrive.Folders = _editFolder(nDrive.Folders!, parentFolder, "insert", n_folder);

        return nDrive;
    }

    public Drive InsertProject(
        IProjectRepository _projectRepository, 
        Drive drive, 
        string organizationId, 
        string parentFolder, 
        string projectName
    )
    {
        ProjectView projectView = new ProjectView();
        projectView.ProjectId = Guid.NewGuid().ToString();
        projectView.ProjectName = projectName;

        //Build the database version
        ProjectData projectDB = new ProjectData();
        projectDB.ProjectId = projectView.ProjectId;
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
        _projectRepository.CreateProject(projectDB);

        //Update the drive now
        Drive nDrive = drive;
        if(parentFolder == "root")
            nDrive.Projects!.Add(projectView);
        else
            nDrive.Folders = _editProject(nDrive.Folders!, parentFolder, "insert", projectView);

        return nDrive;
    }
}