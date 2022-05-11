using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models;
using System.Text;
using System.Net;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/auth")]
    [ApiVersion("1.0")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ITokenService _tokenService;
        private readonly IUserAuth _userAuth;
        private string generatedToken = null;

        public AuthController(IConfiguration config, ITokenService tokenService, IUserAuth userAuth)
        {
            _config         = config;
            _tokenService   = tokenService;
            _userAuth       = userAuth;
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
        public async Task<IActionResult> AuthControllerRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "Auth working";

            return await SerializeJSON(status);
        }

        [HttpPost("login")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> AuthLogin([FromBody]LoginPost data)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "Login Working";

            return await SerializeJSON(status);
        }
    }
}