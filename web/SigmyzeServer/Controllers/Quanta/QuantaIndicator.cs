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
        GetQuantaIndicatorsResp resp = await _sharedDataset.GetIndicatorPage(quantaId, pageLength, page);
        return await SerializeJSON(resp);
    }

    //implemented in ts
    [HttpGet("{organizationId}/{quantaId}/indicators")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicators(string organizationId, string quantaId)
    {
        GetQuantaIndicatorsResp resp = await _sharedDataset.GetIndicators(quantaId);
        return await SerializeJSON(resp);
    }
}