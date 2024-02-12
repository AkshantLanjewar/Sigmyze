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
        return false;
    }
}