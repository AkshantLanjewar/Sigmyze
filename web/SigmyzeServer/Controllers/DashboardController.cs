using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.UserData;
using Microsoft.AspNetCore.Authorization;
using SigmyzeServer.Services;
using Microsoft.AspNetCore.Authentication;
using System.IdentityModel.Tokens.Jwt;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v{version:apiVersion}/dashboard")]
    [ApiVersion("1.0")]
    public class DashboardController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IUserDataService _userDataService;

        public DashboardController(IConfiguration config, IUserDataService userDataService)
        {
            _config          = config;
            _userDataService = userDataService;
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
        [AllowAnonymous]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> DashboardRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "Dashboard Working";

            return await SerializeJSON(status);
        }

        [HttpGet("projects")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetProjects()
        {   
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "Projects Working";

            ProjectsResp resp   = new ProjectsResp();
            resp.Status         = status;

            string accessToken = await HttpContext.GetTokenAsync("access_token");
            var handler        = new JwtSecurityTokenHandler();
            var jwt            = handler.ReadJwtToken(accessToken);
            string lunarID     = jwt.Claims.First(claim => claim.Type == "Lunar_Id").Value.ToString();

            UserData data = await _userDataService.GetAsync(lunarID);
            if(data == null)
            {
                data          = new UserData();
                data.Lunar_ID = lunarID;
                data.Projects = new List<Project>();

                await _userDataService.CreateAsync(data);
            }

            resp.DashboardData = data;
            return await SerializeJSON(status);
        }
    }
}