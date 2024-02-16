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
        GetQuantaIndicatorResp resp = await _sharedDataset.GetIndicatorById(quantaId, indicatorId);
        return await SerializeJSON(resp);
    }

    [HttpPost("select/indicator")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetSelectedIndicator([FromBody]QuantaQueryBody body)
    {
        GetQuantaIndicatorsResp resp = await _sharedDataset.GetSelectedIndicator(body);
        return await SerializeJSON(resp);
    }

    [HttpPost("select/indicator/{pageLength}/{page}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> PageSelectedIndicators(int pageLength, int page, [FromBody]QuantaQueryBody body)
    {
        GetQuantaIndicatorsResp resp = await _sharedDataset.PageSelectedIndicators(pageLength, page, body);
        return await SerializeJSON(resp);
    }
}