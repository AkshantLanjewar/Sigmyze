using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
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

        QuantaRepositoryDefinition? projectDocument = await _quantaRepository.GetQuantaRepository(token);
        if(projectDocument == null || projectDocument.Validate() == false)
        {
            response.Status = ErrorMsg("invalid_project");
            return await SerializeJSON(response);
        }

        //now we need to construct the data cache object
        response.ShellObject = new DatasetCacheObject();
        response.ShellObject.Categorization = projectDocument.ProjectData!.Store!.Categorization;
        response.ShellObject.DatasetDescription = projectDocument.ProjectData.DatasetDescription;
        response.ShellObject.DatasetId = projectDocument.ProjectData.DatasetId;
        response.ShellObject.DatasetName = projectDocument.ProjectData.DatasetName;
        response.ShellObject.Selectors = projectDocument.ProjectData.Store.Selectors;
        response.ShellObject.TextStore = projectDocument.ProjectData.Store.TextStore;

        return await SerializeJSON(response);
    }
}