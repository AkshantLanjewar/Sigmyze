using Newtonsoft.Json;

namespace SigmyzeServer.Models.User
{
    public class LoginResp 
    {
        [JsonProperty("authorized")]
        public bool Authorized { get; set; }

        [JsonProperty("token")]
        public string Token { get; set; }

        [JsonProperty("message")]
        public string Message { get; set; }
    }

    public class RegisterResp
    {
        [JsonProperty("registered")]
        public bool Registered { get; set; }
        [JsonProperty("message")]
        public string Message { get; set; }
    }
}