using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;

namespace SigmyzeServer.Controllers;

public partial class QuantaController 
{
    [HttpGet("select/indicator/{quantaId}/{indicatorId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicatorById(string quantaId, string indicatorId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "retreived";

        QuantaIndicator? indicator = await _quantaIndicatorRepository.SelectProjectIndicatorId(quantaId, indicatorId);
        GetQuantaIndicatorResp resp = new GetQuantaIndicatorResp();
        if(indicator == null)
        {
            status.Error = true;
            status.MSG = "bad_req";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        resp.Indicator = indicator;
        resp.Status = status;
        return await SerializeJSON(resp);
    }

    [HttpPost("select/indicator")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetSelectedIndicator([FromBody]QuantaQueryBody body)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "fetched";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        if(body.QuantaId == null || body.Params == null)
        {
            status.Error = true;
            status.MSG = "bad_query";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        GetIndicatorsQuery? queryRes = await _quantaIndicatorRepository.SelectProjectIndicator(body.QuantaId, body.Params);
        if(queryRes == null)
        {
            status.Error = true;
            status.MSG = "bad_db_query";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        resp.Status = status;
        resp.Indicators = queryRes.Indicators;
        return await SerializeJSON(resp);
    }

    [HttpPost("select/indicator/{pageLength}/{page}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> PageSelectedIndicators(int pageLength, int page, [FromBody]QuantaQueryBody body)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "paged";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        if(body.QuantaId == null || body.Params == null)
        {
            status.Error = true;
            status.MSG = "bad_query";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        GetIndicatorsQuery? query = await _quantaIndicatorRepository.PageSelectedIndicators(body.QuantaId, body.Params, page, pageLength);
        if(query == null)
        {
            status.Error = true;
            status.MSG = "invalid_quanta";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        resp.Status = status;
        resp.Indicators = query.Indicators;
        return await SerializeJSON(resp);
    }
}