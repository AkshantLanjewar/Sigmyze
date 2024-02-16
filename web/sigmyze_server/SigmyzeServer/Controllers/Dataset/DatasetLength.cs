using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Controllers;

public partial class DatasetController
{
    [HttpPost("select/indicator_length")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetSelectorIndicatorsLength([FromBody]DatasetQueryBody body)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "working";

        GetQuantaIndicatorsLengthResp resp = new GetQuantaIndicatorsLengthResp();
        if(body.Token == null)
        {
            msg = ErrorMsg("no_token");
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        string? quantaId = await GetQuantaId(body.Token);
        if(quantaId == null)
        {
            PublishedDatasetCollection? document = await _publishService.FetchPublishedDataset(body.Token);
            quantaId = document?.QuantaId;
        }

        if(quantaId == null)
        {
            msg = ErrorMsg("no_quanta");
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        QuantaQueryBody phantomBody = new QuantaQueryBody();
        phantomBody.Params = body.Params;
        phantomBody.QuantaId = quantaId;

        resp = await _sharedDataset.GetSelectorIndicatorsLength(phantomBody);
        return await SerializeJSON(resp);
    }

    [HttpGet("{token}/indicators_length")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicatorsLength(string token)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "working";

        GetQuantaIndicatorsLengthResp resp = new GetQuantaIndicatorsLengthResp();
        string? quantaId = await GetQuantaId(token);
        if(quantaId == null)
        {
            PublishedDatasetCollection? document = await _publishService.FetchPublishedDataset(token);
            quantaId = document?.QuantaId;
        }

        if(quantaId == null)
        {
            msg = ErrorMsg("no_token");
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        resp = await _sharedDataset.GetIndicatorsLength(quantaId);
        return await SerializeJSON(resp);
    }
}