using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.UserData
{
    public class ProjectsResp
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("dashboard_data")]
        public UserData DashboardData { get; set; }
    }
}