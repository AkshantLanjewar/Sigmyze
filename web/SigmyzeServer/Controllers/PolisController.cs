using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Polis;
using SigmyzeServer.Services.DatabaseServices;
using Microsoft.AspNetCore.Authorization;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/v{version:apiVersion}/polis")]
    [ApiVersion("1.0")]
    public class PolisController : ControllerBase
    {
        private readonly IPolisService _polisService;

        public PolisController(IPolisService polisService)
        {
            _polisService = polisService;
        }

        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> PolisControllerRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "Polis Endpoint Working";

            return await SerializeJSON(status);
        }

        [HttpGet("get/{polisId}")]
        public async Task<IActionResult> GetPolis(string polisId)
        {
            Polis? polis = await _polisService.GetPolis(polisId);
            if(polis == null)
            {
                APIStatusMsg status = new APIStatusMsg();
                status.Error = true;
                status.MSG   = "polis_dne";

                return await SerializeJSON(status);
            }

            return await SerializeJSON(polis);
        }

        private async Task<IActionResult> SerializeJSON(object data)
        {
            string content = await Task.Run(() => JsonConvert.SerializeObject(data));
            return Content(
                content,
                "application/json"
            );
        }
    }
}