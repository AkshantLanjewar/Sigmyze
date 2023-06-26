using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;

namespace SigmyzeServer.Controllers;

public partial class DatasetController
{
    [HttpPost("select/indicator")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetSelectedIndicator([FromBody]DatasetQueryBody body)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "working";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        if(body.Token == null)
        {
            msg = ErrorMsg("no_token");
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        string? quantaId = await GetQuantaId(body.Token);
        if(quantaId == null)
        {
            msg = ErrorMsg("no_quanta");
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        QuantaQueryBody phantomBody = new QuantaQueryBody();
        phantomBody.Params = body.Params;
        phantomBody.QuantaId = quantaId;
        
        resp = await _sharedDataset.GetSelectedIndicator(phantomBody);
        return await SerializeJSON(resp);
    }

    [HttpPost("select/indicator/{pageLength}/{page}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> PageSelectedIndicators(int pageLength, int page, [FromBody]DatasetQueryBody body)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "working";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        if(body.Token == null)
        {
            msg = ErrorMsg("no_token");
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        string? quantaId = await GetQuantaId(body.Token);
        if(quantaId == null)
        {
            msg = ErrorMsg("no_quanta");
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        QuantaQueryBody phantomBody = new QuantaQueryBody();
        phantomBody.Params = body.Params;
        phantomBody.QuantaId = quantaId;

        resp = await _sharedDataset.PageSelectedIndicators(pageLength, page, phantomBody);
        return await SerializeJSON(resp);
    }

    [HttpGet("select/indicator/{token}/{indicatorId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicatorById(string token, string indicatorId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "working";

        GetQuantaIndicatorResp resp = new GetQuantaIndicatorResp();
        string? quantaId = await GetQuantaId(token);
        if(quantaId == null)
        {
            msg = ErrorMsg("no_quanta");
            resp.Status = msg;

            return await SerializeJSON(resp);
        }

        resp = await _sharedDataset.GetIndicatorById(quantaId, indicatorId);
        return await SerializeJSON(resp);
    }
}