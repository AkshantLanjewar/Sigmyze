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
    public class OrganizationController : OrganizationControllerBase
    {
        private readonly IUserServiceRepository _userServiceRepository;
        private readonly IOrganizationRepository _organizationRepository;
        private readonly IDriveRepository _driveRepository;
        
        public OrganizationController(
            IUserServiceRepository userServiceRepository,
            IOrganizationRepository organizationRepository,
            IDriveRepository driveRepository
        ) : base(organizationRepository)
        {
            _userServiceRepository = userServiceRepository;
            _organizationRepository = organizationRepository;
            _driveRepository = driveRepository;
        }

        private string GetUsername(string token)
        {
            var handler    = new JwtSecurityTokenHandler();
            var jwt        = handler.ReadJwtToken(token);
            string username = jwt.Claims.First(claim => claim.Type == "Username").Value.ToString();

            return username;
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
            string username = GetUsername(accessToken);

            UserServiceIndex? userServicesIndex = await _userServiceRepository.GetUserService(lunarId);
            if(userServicesIndex == null)
            {
                //TODO: Implement the creation of the default user organization space
                Organization nOrganization = new Organization();
                nOrganization.OrganizationId = Guid.NewGuid().ToString();
                nOrganization.Users = new List<string> { lunarId };
                nOrganization.OrganizationName = $"{username}'s Drive";
                await _organizationRepository.InsertOrganization(nOrganization);

                LinkedOrganization linkedOrg = new LinkedOrganization();
                linkedOrg.OrganizationId = nOrganization.OrganizationId;
                linkedOrg.OrganizationName = nOrganization.OrganizationName;

                //TODO: Impelment the creation of the default users service index
                UserServiceIndex nService = new UserServiceIndex();
                nService.UserId = lunarId;
                nService.LinkedOrganizations = new List<LinkedOrganization> { linkedOrg };

                userServicesIndex = nService;
                await _userServiceRepository.InsertUserService(nService);
            }

            OrganizationRootResp resp = new OrganizationRootResp();
            resp.msg = status;
            resp.Organizations = userServicesIndex.LinkedOrganizations;
            return await SerializeJSON(resp);
        }

        //FEATURE: This route grabs the drive relating to a selected organizationid
        [HttpGet("drive/{organization_id}")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> GetDrive(string? organization_id)
        {
            APIStatusMsg msg = new APIStatusMsg();
            msg.MSG = "working";
            msg.Error = false;

            string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
            string lunarId = GetLunarID(accessToken);
            if(organization_id == null)
            {
                msg.MSG = "no organization id";
                msg.Error = true;
                return await SerializeJSON(msg);
            }

            //NOTE: If the user services index doesnt exist, the endpoint will return an error
            //If this error occurs, re run the index route as a service index is created there
            UserServiceIndex? userServicesIndex = await _userServiceRepository.GetUserService(lunarId);
            if(userServicesIndex == null)
            {
                msg.MSG = "bad_config";
                msg.Error = true;
                return await SerializeJSON(msg);
            }

            //NOTE: if the org isnt found terminate as unauthorized double check with actual org
            Organization? organization = await ValidateOrganization(userServicesIndex, organization_id);
            if(organization == null)
            {
                msg.MSG = "no_auth";
                msg.Error = true;
                return await SerializeJSON(msg);
            }

            string driveId = organization.LinkedDriveId!;
            Drive? drive = await _driveRepository.GetDrive(driveId);
            if(drive == null)
            {
                msg.MSG = "no_drive";
                msg.Error = true;
                return await SerializeJSON(msg);
            }
            
            return await SerializeJSON(drive);
        }
    }
}