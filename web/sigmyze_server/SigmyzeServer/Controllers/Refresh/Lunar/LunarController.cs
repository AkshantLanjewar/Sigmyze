using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Controllers.Lunar;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.Lunar;
using SigmyzeServer.Services.OrganizationServices;
using SigmyzeServer.Services.Web.Lunar;

namespace SigmyzeServer.Controllers;

[ApiController]
[Authorize]
[Route("/api/v{version:apiVersion}/refresh/lunar")]
[ApiVersion("1.0")]
public class LunarRefreshController : ControllerBase
{
    private readonly IUserServiceRepository _userServiceRepository;
    private readonly ILunarRefreshService _lunarRefreshService;

    public LunarRefreshController(
        IUserServiceRepository userServiceRepository, 
        ILunarRefreshService lunarRefreshService
    )
    {
        this._userServiceRepository = userServiceRepository;
        this._lunarRefreshService = lunarRefreshService;
    }

    protected async Task<IActionResult> SerializeJSON(object data)
	{
		string content = await Task.Run(() => JsonConvert.SerializeObject((data)));
		return Content(
			content,
			"application/json"
		);
	}

    [HttpPost("create")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> CreateLunarProject([FromBody]CreateLunarProjectBody body)
    {
        //validate the body
        if(body.Validate() == false)
            return await SerializeJSON(CreateLunarProjectResponse.ErrorResponse("bad_body"));

        //now we validate that the user is a part of the organization
        UserServiceIndex? userIndex = await _userServiceRepository.GetUserService(body.LunarId!);
        if(userIndex == null || userIndex.IsInOrganization(body.OrganizationId!) == false)
            return await SerializeJSON(CreateLunarProjectResponse.ErrorResponse("bad_organization"));

        string? returnId = await _lunarRefreshService.CreateProject(body.OrganizationId!, body.ProjectId!, body.Name!);
        return await SerializeJSON(CreateLunarProjectResponse.SuccessfulResponse(returnId));
    }

    [HttpPost("delete")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> DeleteLunarProject([FromBody]DeleteLunarProjectBody body)
    {
        //validate the body
        if(body.Validate() == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_body"));

        //first we want to validate that the user is a part of the organization
        UserServiceIndex? userIndex = await _userServiceRepository.GetUserService(body.LunarId!);
        if(userIndex == null || userIndex.IsInOrganization(body.OrganizationId!) == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_organization"));
        
        await _lunarRefreshService.DeleteProject(body.OrganizationId!, body.ProjectId!);
        return await SerializeJSON(APIStatusMsg.SuccessMSG("success"));
    }

    [HttpGet("{lunarId}/{organizationId}/{projectId}")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> FetchLunarProjectData(string lunarId, string organizationId, string projectId)
    {
        //first we want to validate that the user is a part of the organization
        UserServiceIndex? userIndex = await _userServiceRepository.GetUserService(lunarId);
        if(userIndex == null || userIndex.IsInOrganization(organizationId) == false)
            return await SerializeJSON(FetchProjectDataResponse.ErrorResponse("bad_organization"));
        
        LunarProjectData? projectData = await _lunarRefreshService.GetProjectData(organizationId, projectId);
        if(projectData == null)
            return await SerializeJSON(FetchProjectDataResponse.ErrorResponse("bad_project_id"));
        else
            return await SerializeJSON(FetchProjectDataResponse.SuccessResponse(projectData));
    }

    [HttpPost("update/file-tree")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateLunarFileTree([FromBody]UpdateLunarFileTreeBody body)
    {
        //validate the body
        if(body.Validate() == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_body"));

        UserServiceIndex? userIndex = await _userServiceRepository.GetUserService(body.LunarId!);
        if(userIndex == null || userIndex.IsInOrganization(body.OrganizationId!) == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_organization"));
        
        await _lunarRefreshService.UpdateFileTree(body.OrganizationId!, body.ProjectId!, body.NewFiletree!);
        return await SerializeJSON(APIStatusMsg.SuccessMSG("success"));
    }

    [HttpPost("update/chart")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateLunarChart([FromBody]UpdateLunarChartsBody body)
    {
        //validate the body
        if(body.Validate() == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_body"));

        UserServiceIndex? userIndex = await _userServiceRepository.GetUserService(body.LunarId!);
        if(userIndex == null || userIndex.IsInOrganization(body.OrganizationId!) == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_organization"));

        await _lunarRefreshService.UpdateChart(body.OrganizationId!, body.ProjectId!, body.NewCharts!);
        return await SerializeJSON(APIStatusMsg.SuccessMSG("success"));
    }

    [HttpPost("update/notes")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateLunarNote([FromBody]UpdateLunarNotesBody body)
    {
        //validate the body
        if(body.Validate() == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_body"));

        UserServiceIndex? userIndex = await _userServiceRepository.GetUserService(body.LunarId!);
        if(userIndex == null || userIndex.IsInOrganization(body.OrganizationId!) == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_organization"));

        await _lunarRefreshService.UpdateNote(body.OrganizationId!, body.ProjectId!, body.NewNotes!);
        return await SerializeJSON(APIStatusMsg.SuccessMSG("success"));
    }

    [HttpPost("update/name")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateLunarName([FromBody]UpdateLunarNameBody body)
    {
        //validate the body
        if(body.Validate() == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_body"));

        UserServiceIndex? userIndex = await _userServiceRepository.GetUserService(body.LunarId!);
        if(userIndex == null || userIndex.IsInOrganization(body.OrganizationId!) == false)
            return await SerializeJSON(APIStatusMsg.ErrorMSG("bad_organization"));

        await _lunarRefreshService.UpdateName(body.OrganizationId!, body.ProjectId!, body.Name!);
        return await SerializeJSON(APIStatusMsg.SuccessMSG("success"));
    }
}