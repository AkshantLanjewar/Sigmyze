using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;

namespace SigmyzeServer.Controllers;

public partial class QuantaController 
{
    [HttpPost("execution/preload_data")]
    [DisableRequestSizeLimit]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> UploadPreloadData([FromBody]UploadInternalStoreBody body)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "uploaded";

        if(body.PreloadedData == null)
        {
            msg = ErrorMsg("no_data");
            return await SerializeJSON(msg);
        }

        msg.MSG = await _quantaExecutionService.UploadBody(body.PreloadedData);
        return await SerializeJSON(msg);
    }

    [HttpGet("execution/fetch/{token}")]
    [MapToApiVersion("2.0")]
    [AllowAnonymous]
    public async Task<IActionResult> FetchPreloadData(string token)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "fetched";

        List<QuantaInternalStoreWrapper>? documents = await _quantaExecutionService.GetBody(token);
        GetUploadStoreResponse resp = new GetUploadStoreResponse();
        resp.Status = status;
        resp.Documents = documents;

        if(documents == null)
        {
            resp.Status = ErrorMsg("no_documents");
            return await SerializeJSON(resp);
        }

        return await SerializeJSON(resp);
    }

    [HttpGet("execution/delete/{token}")]
    [MapToApiVersion("2.0")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteData(string token)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "deleted";

        await _quantaExecutionService.DeleteUpload(token);
        return await SerializeJSON(status);
    }
}