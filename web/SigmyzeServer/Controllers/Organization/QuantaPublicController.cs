using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Controllers;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.ApplicationServices.UserData;
using SigmyzeServer.Services.OrganizationServices;

[ApiController]
[AllowAnonymous]
[Route("/api/v{version:apiVersion}/quanta/public")]
[ApiVersion("2.0")]
public class QuantaPublicController : OrganizationControllerBase
{
    private readonly IQuantaRepository _quantaRepository;
    private readonly IQuantaIndicatorRepository _quantaIndicatorRepository;

    public QuantaPublicController(
        IOrganizationRepository organizationRepository,
        IQuantaRepository quantaRepository,
        IQuantaIndicatorRepository quantaIndicatorRepository
    ) : base(organizationRepository)
    {
        _quantaRepository = quantaRepository;
        _quantaIndicatorRepository = quantaIndicatorRepository;
    }

    [HttpGet("indicators_length/{organizationId}/{quantaId}/{processId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicatorsLength(string organizationId, string quantaId, string processId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "length";

        GetQuantaIndicatorsLengthResp resp = new GetQuantaIndicatorsLengthResp();
        QuantaProjectCacheId? cache = await _quantaRepository.GetQuantaProjectCache(quantaId, processId);
        if(cache == null || cache.OrganizationId != organizationId)
        {
            status.Error = true;
            status.MSG = "invalid_cache";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        GetIndicatorsLength? indicatorLength = await _quantaIndicatorRepository.GetProjectIndicatorsLength(quantaId);
        if(indicatorLength == null)
        {
            status.Error = true;
            status.MSG = "quanta_not_found";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        resp.Length = indicatorLength.IndicatorsLength;
        resp.Status = status;
        return await SerializeJSON(resp);
    }

    [HttpGet("indicators_paged/{pageLength}/{page}/{organizationId}/{quantaId}/{processId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetIndicatorsPaged(int pageLength, int page, string organizationId, string quantaId, string processId)
    {
        APIStatusMsg status = new APIStatusMsg();
        status.Error = false;
        status.MSG = "paged";

        GetQuantaIndicatorsResp resp = new GetQuantaIndicatorsResp();
        QuantaProjectCacheId? cache = await _quantaRepository.GetQuantaProjectCache(quantaId, processId);
        if(cache == null || cache.OrganizationId != organizationId)
        {
            status.Error = true;
            status.MSG = "invalid_cache";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        GetIndicatorsQuery? query = await _quantaRepository.GetProjectIndicators(quantaId, page, pageLength);
        if(query == null)
        {
            status.Error = true;
            status.MSG = "invalid_quanta";
            resp.Status = status;

            return await SerializeJSON(resp);
        }

        resp.Status = status;
        resp.Indicators = query.Indicators;
        return await SerializeJSON(resp);
    }
}