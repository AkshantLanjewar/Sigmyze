using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.UserData
{
    public class DriveResp
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("drive")]
        public Drive? Drive { get; set; }
    }
}