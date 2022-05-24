using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/v{version:apiVersion}/datasets")]
    [ApiVersion("1.0")]
    public class MapsController : ControllerBase
    {
        private string URL_ROOT = "http://34.66.146.203:8080";
        public MapsController()
        {

        }

        private async Task<IActionResult> SerializeJSON(object data)
        {
            string content = await Task.Run(() => JsonConvert.SerializeObject(data));
            return Content(
                content,
                "application/json"
            );
        }

        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> MapsControllerRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "Maps Endpoint Working";

            return await SerializeJSON(status);
        }
    }
}