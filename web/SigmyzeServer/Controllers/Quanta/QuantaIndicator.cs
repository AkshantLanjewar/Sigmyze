using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;

namespace SigmyzeServer.Controllers;

public partial class QuantaController 
{
    [HttpGet("{quantaId}/{pageLength}/indicators/{page}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicatorPage(string quantaId, int pageLength, int page)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "paged";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        GetIndicatorsQuery? query = await _quantaRepository.GetProjectIndicators(quantaId, page, pageLength);
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

    //implemented in ts
    [HttpGet("{organizationId}/{quantaId}/indicators")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicators(string organizationId, string quantaId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "retreive";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        GetIndicatorsQuery? indicatorsRes = await _quantaIndicatorRepository.PageSelectedIndicators(
            quantaId, 
            new List<QuantaQuery>(), 
            0, 
            20
        );

        List<QuantaIndicator>? indicators = indicatorsRes?.Indicators;
        if (indicators == null)
        {
            status.Error = true;
            status.MSG = "invalid_quanta";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        
        resp.Status = status;
        resp.Indicators = indicators;
        return await SerializeJSON(resp);
    }
}