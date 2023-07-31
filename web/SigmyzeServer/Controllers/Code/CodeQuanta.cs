using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices.Code;

namespace SigmyzeServer.Controllers;

public partial class CodeController
{
    [HttpGet("quanta/{quantaId}/suppository")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetQuantaCodeSuppository(string quantaId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "get";

        QuantaSuppositoryResp resp = new QuantaSuppositoryResp();
        if(_quantaRepository.GetProjectData(quantaId) == null)
        {
            msg.Error = true;
            msg.MSG = "no_project";
            resp.MSG = msg;

            return await SerializeJSON(resp);
        }

        QuantaSuppository suppository = await _codeRepository.GetQuantaSuppository(quantaId);
        resp.Items = suppository.Items;
        return await SerializeJSON(resp);
    }

    [HttpPost("quanta/{quantaId}/suppository/create")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> CreateQuantaSuppositorySelector(
        [FromBody]CreateQuantaSelectorBody body, 
        string quantaId
    )
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "created";

        if(body.SelectorId == null || body.Title == null)
        {
            msg.Error = true;
            msg.MSG = "no_params";
            return await SerializeJSON(msg);
        }

        if(_quantaRepository.GetProjectData(quantaId) == null)
        {
            msg.Error = true;
            msg.MSG = "invalid_project";
            return await SerializeJSON(msg);
        }

        await _codeRepository.CreateQuantaSuppositoryProject(quantaId, body.Title, body.SelectorId);
        return await SerializeJSON(msg);
    }

    [HttpPost("quanta/{quantaId}/suppository/delete")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> DeleteQuantaSuppositorySelector(
        [FromBody]DeleteQuantaSelectorBody body, 
        string quantaId
    ) 
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "deleted";

        if(body.CodeId == null)
        {
            msg.Error = true;
            msg.MSG = "no_params";
            return await SerializeJSON(msg);
        }

        if(_quantaRepository.GetProjectData(quantaId) == null)
        {
            msg.Error = true;
            msg.MSG = "invalid_project";
            return await SerializeJSON(msg);
        }

        await _codeRepository.DeleteQuantaSuppositoryProject(quantaId, body.CodeId);
        return await SerializeJSON(msg);
    }
}