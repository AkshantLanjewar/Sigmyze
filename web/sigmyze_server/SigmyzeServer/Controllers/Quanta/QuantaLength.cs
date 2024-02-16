using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.ApplicationServices;

namespace SigmyzeServer.Controllers;

public partial class QuantaController 
{
    [HttpPost("select/indicator_length")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetSelectorIndicatorsLength([FromBody]QuantaQueryBody body)
    {
        GetQuantaIndicatorsLengthResp resp = await _sharedDataset.GetSelectorIndicatorsLength(body);
        return await SerializeJSON(resp);
    }

    [HttpGet("{quantaId}/indicators_length")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicatorsLength(string organizationId, string quantaId)
    {
        GetQuantaIndicatorsLengthResp resp = await _sharedDataset.GetIndicatorsLength(quantaId);
        return await SerializeJSON(resp);
    }
}