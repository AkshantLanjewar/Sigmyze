using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;

public class GetProjectResp
{
    [JsonProperty("status")]
    public APIStatusMsg? Status { get; set; }

    [JsonProperty("project_data")]
    public ProjectData? ProjectData { get; set; }
}