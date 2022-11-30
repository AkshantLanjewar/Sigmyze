using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Polis;
using SigmyzeServer.Models.Organizations;
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
        private readonly IOrganizationService _organizationService;

        public PolisController(IPolisService polisService, IOrganizationService organizationService)
        {
            _polisService        = polisService;
            _organizationService = organizationService;
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

            //update the polis data
            string organization_id    = polis.OrganizationId!;
            Organization organization = (await _organizationService.GetOrganization(organization_id))!;
            
            if(polis.Data == null)
                polis.Data = new PolisData();
            if(organization.Published != null)
                polis.Data.Articles = organization.Published;

            await _polisService.SavePolis(polisId, polis);
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