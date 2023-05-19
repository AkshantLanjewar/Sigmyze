using Newtonsoft.Json;

namespace SigmyzeServer.Models.API
{
    public class APIStatusMsg
    {
        [JsonProperty("error")]
        public bool Error { get; set; }

        [JsonProperty("msg")]
        public string MSG { get; set; }
    }
}