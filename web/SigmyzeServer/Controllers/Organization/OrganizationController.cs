using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Controllers
{   
    [ApiController]
    [Authorize]
    [Route("api/v{version:apiVersion}/organizations")]
    [ApiVersion("2.0")]
    public class OrganizationController : ControllerBase
    {
        private readonly IUserServiceRepository _userServiceRepository;
        
        public OrganizationController(IUserServiceRepository userServiceRepository)
        {
            _userServiceRepository = userServiceRepository;
        }

        private async Task<IActionResult> SerializeJSON(object data)
        {
            string content = await Task.Run(() => JsonConvert.SerializeObject(data));
            return Content(
                content,
                "application/json"
            );
        }

        private string GetLunarID(string token)
        {
            var handler    = new JwtSecurityTokenHandler();
            var jwt        = handler.ReadJwtToken(token);
            string lunarID = jwt.Claims.First(claim => claim.Type == "Lunar_Id").Value.ToString();

            return lunarID;
        }

        //FEATURE: This is the root route of the organizations controller, in which it returns the list of organizations the 
        //user is a part of. 
        [HttpGet]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> OrganizationRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "Organization working";

            string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
            string lunarId = GetLunarID(accessToken);
            UserServiceIndex? userServicesIndex = await _userServiceRepository.GetUserService(lunarId);
            if(userServicesIndex == null)
            {
                //TODO: Implement the creation of the default user organization space

                //TODO: Impelment the creation of the default users service index
            }

            return await SerializeJSON(status);
        }
    }
}