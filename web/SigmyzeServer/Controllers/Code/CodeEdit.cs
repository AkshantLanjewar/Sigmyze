using Microsoft.AspNetCore.Authorization;
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

    [HttpGet("get/template/{templateId}")]
    [MapToApiVersion("2.0")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCodeTemplate(string templateId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "retreivd";

        //check if valid template
        GetCodeProjectResp resp = new GetCodeProjectResp();
        string template_location = "./data/templates/" + templateId;
        if(!Directory.Exists(template_location))
        {
            msg.Error = true;
            msg.MSG = "invalid_template";
            resp.MSG = msg;

            return await SerializeJSON(resp);
        }
        
        CodeFilesystem filesystem = _codeRepository.TemplateWalk(template_location);
        resp.Filesystem = filesystem;
        return await SerializeJSON(resp);
    }
}