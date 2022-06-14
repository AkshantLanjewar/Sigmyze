using Newtonsoft.Json;

namespace SigmyzeServer.Models.API
{
    public class DatasetsResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("datasets")]
        public List<string> Datasets { get; set; }
    }
}