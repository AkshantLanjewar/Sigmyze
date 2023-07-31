using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Controllers;

public partial class DatasetController
{
    [Authorize]
    [HttpPost("publish/new")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> PublishDataset([FromBody]PublishDatasetPOST data)
    {
        APIStatusMsg msg = new APIStatusMsg();
        string result = await _publishService.PublishDataset(data);
        switch(result) {
            case "success":
                msg.Error = false;
                msg.MSG = "published";

                break;
            case "verify":
                msg.Error = true;
                msg.MSG = "bad_post";

                break;
            case "dataset":
                msg.Error = true;
                msg.MSG = "no_dataset";

                break;
            case "no_token":
                msg = ErrorMsg("no_token");
                break;
            case "invalid_token":
                msg = ErrorMsg("invalid_token");
                break;
            default:
                msg.Error = true;
                msg.MSG = "malformed_request";

                break;
        }

        return await SerializeJSON(msg);
    }

    [Authorize]
    [HttpGet("publish/published/{quantaId}")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> IsPublished(string quantaId)
    {
        PublishedDatasetCollection? document = await _publishService.FetchPublishedDatasetQ(quantaId);
        APIStatusMsg msg = new APIStatusMsg();
        msg.MSG = "error_bool";
        msg.Error = document != null;

        return await SerializeJSON(msg);
    }

    [HttpGet("published/{datasetId}/is_public")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> IsPublic(string datasetId)
    {
        PublishedDatasetCollection? document = await _publishService.FetchPublishedDataset(datasetId);
        APIStatusMsg msg = new APIStatusMsg();
        msg.MSG = "error_bool";
        if(document == null || document.Public == null)
        {
            msg.Error = false;
            return await SerializeJSON(msg);
        }

        msg.Error = (bool)document.Public;
        return await SerializeJSON(msg);
    }

    [HttpGet("published/{datasetId}/authorized")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> IsDatasetAuthorized(string datasetId)
    {
        APIStatusMsg msg = new APIStatusMsg();
        msg.MSG = "error_bool";
        PublishedDatasetCollection? document = await _publishService.FetchPublishedDataset(datasetId);
        if(document == null || document.QuantaId == null)
        {
            msg.Error = false;
            return await SerializeJSON(msg);
        }

        //get the organization id
        QuantaRepositoryDefinition? repository = await _quantaRepository.GetQuantaRepository(document.QuantaId);
        if(repository == null || repository.OrganizationId == null)
        {
            msg.Error = false;
            return await SerializeJSON(msg);
        }

        string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
        string lunarId = GetLunarID(accessToken);

        msg.Error = await _organizationRepository.WithinOrganization(repository.OrganizationId, lunarId);
        return await SerializeJSON(msg);
    }

    [Authorize]
    [HttpPost("publish/unpublish")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> UnpublishDataset([FromBody]UnpublishDatasetPOST data)
    {
        APIStatusMsg msg = new APIStatusMsg();
        string result = await _publishService.UnpublishDataset(data);
        switch(result) {
            case "success":
                msg.Error = false;
                msg.MSG = "unpubilshed";

                break;
            case "verify":
                msg.Error = true;
                msg.MSG = "bad_post";

                break;
            case "no_document":
                msg.Error = false;
                msg.MSG = "dne";

                break;
            default:
                msg.Error = true;
                msg.MSG = "malformed_request";

                break;
        }

        return await SerializeJSON(msg);
    }

    [Authorize]
    [HttpGet("published/{organizationId}/published")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetUserPublishedDatasets(string organizationId)
    {
        GetDatasetCardsResponse response = new GetDatasetCardsResponse();
        response.Status = SuccessMsg();

        string accessToken = (await HttpContext.GetTokenAsync("access_token"))!;
        string lunarId = GetLunarID(accessToken);
        if(await _organizationRepository.WithinOrganization(organizationId, lunarId) == false)
        {
            response.Status = ErrorMsg("outside_org");
            return await SerializeJSON(response);
        }

        List<QuantaDatasetDisplay>? cards = await _publishService.GetDatasetCards(organizationId);
        if(cards == null)
        {
            response.Status = ErrorMsg("no_cards");
            return await SerializeJSON(response);
        }

        response.DatasetCards = cards;
        return await SerializeJSON(response);
    }

    [HttpGet("published/public")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> GetPublicDatasets()
    {
        GetDatasetCardsResponse response = new GetDatasetCardsResponse();
        response.Status = SuccessMsg();
        List<QuantaDatasetDisplay>? cards = await _publishService.GetDatasetCards("public");
        if(cards == null)
            cards = new List<QuantaDatasetDisplay>();

        response.DatasetCards = cards;
        return await SerializeJSON(response);
    }
}