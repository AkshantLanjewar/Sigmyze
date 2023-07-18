using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SigmyzeServer.Models.API;
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
                msg.Error = true;
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

    [Authorize]
    [HttpPost("publish/unpublish")]
    [MapToApiVersion("2.0")]
    public async Task<IActionResult> UnpublishDataset([FromBody]UnpublishDatasetPOST data)
    {
        APIStatusMsg msg = new APIStatusMsg();
        string result = await _publishService.UnpublishDataset(data);
        switch(result) {
            case "success":
                msg.Error = true;
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
}