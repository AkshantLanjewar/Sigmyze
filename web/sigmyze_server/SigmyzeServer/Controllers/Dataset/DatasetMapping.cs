using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Controllers;

public partial class DatasetController
{
    [HttpGet("map/create/{quantaId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> CreateQuantaMapping(string quantaId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "working";

        CreateMappingResponse response = new CreateMappingResponse();
        response.Status = msg;
        if(await _quantaDatasetService.QuantaIdExists(quantaId))
        {
            msg = ErrorMsg("mapping_exists");
            response.Status = msg;

            return await SerializeJSON(response);
        }

        string token = await _quantaDatasetService.CreateQuantaMapping(quantaId);
        response.Token = token;
        return await SerializeJSON(response);
    }

    [HttpGet("map/delete/{token}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> DeleteQuantaMapping(string token)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "deleted";

        await _quantaDatasetService.DeleteMapping(token);
        return await SerializeJSON(msg);
    }

    [HttpGet("map/get/{quantaId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetQuantaMapping(string quantaId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "working";

        CreateMappingResponse response = new CreateMappingResponse();
        response.Status = msg;
        if(await _quantaDatasetService.QuantaIdExists(quantaId) == false)
        {
            msg = ErrorMsg("no_mapping");
            response.Status = msg;

            return await SerializeJSON(response);
        }

        string? token = await _quantaDatasetService.GetToken(quantaId);
        if(token == null)
        {
            msg = ErrorMsg("no_token");
            response.Status = msg;

            return await SerializeJSON(response);
        }

        response.Token = token;
        return await SerializeJSON(response);
    }

    private async Task<string?> GetQuantaId(string token) =>
        await _quantaDatasetService.GetQuantaId(token);
}