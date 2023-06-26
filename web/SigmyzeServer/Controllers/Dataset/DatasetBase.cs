using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Services.DatabaseServices;
using SigmyzeServer.Services.DatasetShared;
using SigmyzeServer.Services.OrganizationServices;

namespace SigmyzeServer.Controllers;

[ApiController]
[AllowAnonymous]
[Route("/api/v{version:apiVersion}/dataset")]
[ApiVersion("2.0")]
public partial class DatasetController : OrganizationControllerBase
{
    private readonly IQuantaDatasetService _quantaDatasetService;
    private readonly DatasetShared _sharedDataset;

    public DatasetController(
        IOrganizationRepository organizationRepository,
        IQuantaDatasetService quantaDatasetService,
        IQuantaIndicatorRepository quantaIndicatorRepository,
        IQuantaRepository quantaRepository
    ) : base(organizationRepository)
    {
        _quantaDatasetService = quantaDatasetService;
        _sharedDataset = new DatasetShared(quantaDatasetService, quantaIndicatorRepository, quantaRepository);
    }

    [HttpGet]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> DatasetControllerRoot()
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.Error = false;
        msg.MSG = "endpoint_working";

        return await SerializeJSON(msg);
    }
}