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
        return false;
    }
}
