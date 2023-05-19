using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;

namespace SigmyzeServer.Controllers;

public partial class QuantaController 
{
    [HttpPost("select/indicator_length")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetSelectorIndicatorsLength([FromBody]QuantaQueryBody body)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "fetched";

        GetQuantaIndicatorsLengthResp resp = new GetQuantaIndicatorsLengthResp();
        if(body.QuantaId == null || body.Params == null)
        {
            status.Error = true;
            status.MSG = "bad_query";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        GetIndicatorsLength? query = await _quantaIndicatorRepository.SelectProjectIndicatorLength(body.QuantaId, body.Params);
        if(query == null)
        {
            status.Error = true;
            status.MSG = "quanta_not_found";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        resp.Status = status;
        resp.Length = query.IndicatorsLength;
        return await SerializeJSON(resp);
    }

    [HttpGet("{quantaId}/indicators_length")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicatorsLength(string organizationId, string quantaId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "length";

        GetQuantaIndicatorsLengthResp resp = new GetQuantaIndicatorsLengthResp();
        GetIndicatorsLength? indicatorLength = await _quantaIndicatorRepository.GetProjectIndicatorsLength(quantaId);
        if(indicatorLength == null)
        {
            status.Error = true;
            status.MSG = "quanta_not_found";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        resp.Length = indicatorLength.IndicatorsLength;
        resp.Status = status;
        return await SerializeJSON(resp);
    }
}