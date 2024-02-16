using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.Data
{
    public class CreateMappingResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg? Status { get; set; }

        [JsonProperty("token")]
        public string? Token { get; set; }
    }
}