using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Lunar;

namespace SigmyzeServer.Controllers.Lunar;

public class FetchProjectDataResponse
{
    [JsonProperty("status")]
    public APIStatusMsg? Status { get; set; }

    [JsonProperty("projectData")]
    public LunarProjectData? ProjectData { get; set; }

    public bool Success()
    {
        if(this.Status == null || this.Status.Error == true)
            return false;
        if(this.ProjectData == null)
            return false;

        return true;
    }

    public static FetchProjectDataResponse ErrorResponse(string msg)
    {
        FetchProjectDataResponse response = new FetchProjectDataResponse
        {
            Status = new APIStatusMsg 
            {
                Error = true,
                MSG = msg
            }
        };

        return response;
    }

    public static FetchProjectDataResponse SuccessResponse(LunarProjectData data)
    {
        FetchProjectDataResponse response = new FetchProjectDataResponse
        {
            Status = new APIStatusMsg
            {
                Error = false,
                MSG = "success"
            },

            ProjectData = data
        };

        return response;
    }
}