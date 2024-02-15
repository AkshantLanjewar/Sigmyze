using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Controllers.Lunar;

public class CreateLunarProjectResponse
{
    [JsonProperty("status")]
    public APIStatusMsg? Status { get; set; }

    [JsonProperty("newId")]
    public string? NewId { get; set; }

    public bool Success()
    {
        if(this.Status != null && this.Status.Error == false)
            return true;

        return false;
    }

    public static CreateLunarProjectResponse SuccessfulResponse(string? id = null)
    {
        CreateLunarProjectResponse response = new CreateLunarProjectResponse
        {
            Status = new APIStatusMsg
            {
                Error = false,
                MSG = "success"
            },

            NewId = id
        };

        return response;
    }

    public static CreateLunarProjectResponse ErrorResponse(string errorMsg)
    {
        CreateLunarProjectResponse response = new CreateLunarProjectResponse
        {
            Status = new APIStatusMsg
            {
                Error = true,
                MSG = errorMsg
            }
        };

        return response;
    }
}
