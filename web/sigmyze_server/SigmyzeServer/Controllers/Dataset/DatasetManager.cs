using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Controllers;

public partial class DatasetController
{
    [HttpGet("{token}/prime")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> PrimeDataset(string token)
    {
        PrimeResponse response = new PrimeResponse();
        PublishedDatasetCollection? publishedDocument = await _publishService.FetchPublishedDataset(token);
        if(publishedDocument == null || publishedDocument.QuantaId == null)
        {
            response.Status = ErrorMsg("invalid_dataset");
            return await SerializeJSON(response);
        }

        string quantaId = publishedDocument.QuantaId;
        QuantaRepositoryDefinition? projectDocument = await _quantaRepository.GetQuantaRepository(quantaId);
        if(projectDocument == null || projectDocument.Validate() == false)
        {
            response.Status = ErrorMsg("invalid_project");
            return await SerializeJSON(response);
        }

        //now we need to construct the data cache object
        response.ShellObject = new DatasetCacheObject
        {
            Categorization = projectDocument.ProjectData!.Store!.Categorization,
            DatasetDescription = projectDocument.ProjectData.DatasetDescription,
            DatasetId = projectDocument.ProjectData.DatasetId,
            DatasetName = projectDocument.ProjectData.DatasetName,
            Selectors = projectDocument.ProjectData.Store.Selectors,
            TextStore = projectDocument.ProjectData.Store.TextStore,
            Schemas = projectDocument.ProjectData.DatasetSchema
        };

        return await SerializeJSON(response);
    }

    [HttpGet("{datasetId}/node-editors")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetDatasetNodeEditors(string datasetId)
    {
        DatasetNodeEditorsResponse response = new DatasetNodeEditorsResponse();
        PublishedDatasetCollection? publishedDocument = await _publishService.FetchPublishedDataset(datasetId);
        response.Status = SuccessMsg();
        if(publishedDocument == null || publishedDocument.QuantaId == null)
        {
            response.Status = ErrorMsg("invalid_dataset");
            return await SerializeJSON(response);
        }

        string quantaId = publishedDocument.QuantaId;
        GetProjectDataQuery? projectData = await _quantaRepository.GetProjectData(quantaId);
        if(projectData == null || projectData.ProjectData == null || projectData.ProjectData.Store?.EditorProjects == null || projectData.ProjectData.Files == null)
        {
            response.Status = ErrorMsg("invalid_project_data");
            return await SerializeJSON(response);
        }

        //now we need to collect node-editor data and sort it based on its usage
        List<QuantaEditorProject> editorProjects = projectData.ProjectData.Store.EditorProjects;
        List<QuantaFile> quantaFiles = projectData.ProjectData.Files;

        string? addIndicatorId = null;
        string? updateIndicatorId = null;
        for(int i = 0; i < quantaFiles.Count; i++)
        {
            QuantaFile file = quantaFiles[i];
            if(file.Name == "Create Dataset")
                addIndicatorId = file.Id;
            if(file.Name == "Update Dataset")
                updateIndicatorId = file.Id;
        }

        if(addIndicatorId == null || updateIndicatorId == null)
        {
            response.Status = ErrorMsg("invalid_files");
            return await SerializeJSON(response);
        }

        for(int i = 0; i < editorProjects.Count; i++)
        {
            QuantaEditorProject project = editorProjects[i];
            if(project.FileId == addIndicatorId)
                response.FetchEditor = project;
            if(project.FileId == updateIndicatorId)
                response.UpdateEditor = project;
        }

        return await SerializeJSON(response);
    }
}