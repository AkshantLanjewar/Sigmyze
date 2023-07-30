using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Controllers;

public partial class DatasetController
{
    [HttpGet("{token}/indicators")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicators(string token)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "working";

        string? quantaId = await GetQuantaId(token);
        if(quantaId == null)
        {
            PublishedDatasetCollection? document = await _publishService.FetchPublishedDataset(token);
            quantaId = document?.QuantaId;
        }

        GetQuantaIndicatorsResp response = new GetQuantaIndicatorsResp();
        if(quantaId == null)
        {
            msg = ErrorMsg("no_quanta");
            response.Status = msg;

            return await SerializeJSON(response);
        }

        //abstract indicator function to shared class
        response = await _sharedDataset.GetIndicators(quantaId);
        return await SerializeJSON(response);
    }

    [HttpGet("{token}/{pageLength}/indicators/{page}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicatorPage(string token, int pageLength, int page)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "working";

        string? quantaId = await GetQuantaId(token);
        if(quantaId == null)
        {
            PublishedDatasetCollection? document = await _publishService.FetchPublishedDataset(token);
            quantaId = document?.QuantaId;
        }

        GetQuantaIndicatorsResp response = new GetQuantaIndicatorsResp();
        if(quantaId == null)
        {
            msg = ErrorMsg("no_quanta");
            response.Status = msg;

            return await SerializeJSON(response);
        }

        response = await _sharedDataset.GetIndicatorPage(quantaId, pageLength, page);
        return await SerializeJSON(response);
    }
}