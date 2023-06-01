using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices.Code;

namespace SigmyzeServer.Controllers;

public partial class CodeController
{
    [HttpGet("get/{codeId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetCodeRepo(string codeId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "retreived";

        GetCodeProjectResp resp = new GetCodeProjectResp();
        resp.MSG = msg;
        CodeFilesystem? filesystem = await _codeRepository.GetCode(codeId);

        if(filesystem == null)
        {
            msg.Error = true;
            msg.MSG = "invalid_code_project";

            resp.MSG = msg;
            return await SerializeJSON(resp);
        }

        resp.Filesystem = filesystem;
        return await SerializeJSON(resp);
    }
}