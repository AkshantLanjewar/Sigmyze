using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Controllers;

public class OrganizationControllerBase : ControllerBase
{
    private readonly IOrganizationRepository _organizationRepository;
    public OrganizationControllerBase(IOrganizationRepository organizationRepository)
    {
        _organizationRepository = organizationRepository;
    }

    protected async Task<IActionResult> SerializeJSON(object data)
	{
		string content = await Task.Run(() => JsonConvert.SerializeObject((data)));
		return Content(
			content,
			"application/json"
		);
	}

    protected string GetLunarID(string token)
    {
        var handler    = new JwtSecurityTokenHandler();
        var jwt        = handler.ReadJwtToken(token);
        string lunarID = jwt.Claims.First(claim => claim.Type == "Lunar_Id").Value.ToString();

        return lunarID;
    }

    protected APIStatusMsg ErrorMsg(string msg)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = true;
        status.MSG = msg;

        return status;
    }

    protected APIStatusMsg SuccessMsg()
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "success";

        return status;
    }

    //FEATURE: Validate whether a user is a member of organization
    protected async Task<Organization?> ValidateOrganization(UserServiceIndex servicesIndex, string organizationId)
    {
        List<LinkedOrganization> organizations = servicesIndex.LinkedOrganizations!;
        int? orgIndex = null;
        for(int i = 0; i < organizations.Count; i++)
        {
            LinkedOrganization organization = organizations[i];
            if(organization.OrganizationId == organizationId)
                orgIndex = i;
        }

        if(orgIndex == null)
            return null;

        Organization? org = await _organizationRepository.GetOrganization(organizations[orgIndex.Value].OrganizationId!);
        if(org == null)
            return null;

        List<string> users = org.Users!;
        for(int i = 0; i < users.Count; i++)
        {
            string user = users[i];
            if(user == servicesIndex.UserId!)
                return org;
        }

        return null;
    }
}