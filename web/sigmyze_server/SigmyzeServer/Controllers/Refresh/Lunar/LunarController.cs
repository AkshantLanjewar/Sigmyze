using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Controllers.Lunar;
using SigmyzeServer.Models.API;
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
        APIStatusMsg msg = new APIStatusMsg
        {
            Error = false,
            MSG = "success"
        };

        CreateLunarProjectResponse response = new CreateLunarProjectResponse
        {
            Status = msg,
            NewId = null
        };

        return await SerializeJSON(response); 
    }

    [HttpPost("delete")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> DeleteLunarProject([FromBody]DeleteLunarProjectBody body)
    {
        APIStatusMsg msg = new APIStatusMsg
        {
            Error = false,
            MSG = "success"
        };

        return await SerializeJSON(msg);
    }

    [HttpGet("{lunarId}/{organizationId}/projectId")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> FetchLunarProjectData(string lunarId, string organizationId, string projectId)
    {
        APIStatusMsg msg = new APIStatusMsg
        {
            Error = false,
            MSG = "success"
        };

        FetchProjectDataResponse response = new FetchProjectDataResponse
        {
            Status = msg,
            ProjectData = null
        };

        return await SerializeJSON(response);
    }

    [HttpPost("update/file-tree")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateLunarFileTree([FromBody]UpdateLunarFileTreeBody body)
    {
        APIStatusMsg msg = new APIStatusMsg
        {
            Error = false,
            MSG = "success"
        };

        return await SerializeJSON(msg);
    }

    [HttpPost("update/chart")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateLunarChart([FromBody]UpdateLunarChartsBody body)
    {
        APIStatusMsg msg = new APIStatusMsg
        {
            Error = false,
            MSG = "success"
        };

        return await SerializeJSON(msg);
    }

    [HttpPost("update/notes")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateLunarNote([FromBody]UpdateLunarNotesBody body)
    {
        APIStatusMsg msg = new APIStatusMsg
        {
            Error = false,
            MSG = "success"
        };

        return await SerializeJSON(msg);
    }

    [HttpPost("update/name")]
    [MapToApiVersion("1.0")]
    public async Task<IActionResult> UpdateLunarName([FromBody]UpdateLunarNameBody body)
    {
        APIStatusMsg msg = new APIStatusMsg
        {
            Error = false,
            MSG = "success"
        };

        return await SerializeJSON(msg);
    }
}