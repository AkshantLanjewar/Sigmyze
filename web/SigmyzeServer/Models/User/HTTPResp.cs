using Newtonsoft.Json;

namespace SigmyzeServer.Models.User
{
    public class AuthResp 
    {
        [JsonProperty("authorized")]
        public bool Authorized { get; set; }

        [JsonProperty("token")]
        public string? Token { get; set; }

        [JsonProperty("message")]
        public string? Message { get; set; }

        [JsonProperty("Verified")]
        public string? Verified { get; set; }

        [JsonIgnore]
        public string? RefreshToken { get; set; }
    }

    public class RegisterResp
    {
        [JsonProperty("registered")]
        public bool Registered { get; set; }
        
        [JsonProperty("message")]
        public string? Message { get; set; }

        [JsonProperty("token")]
        public string? Token { get; set; }
    }

    public class LogoutResp
    {
        [JsonProperty("logged_out")]
        public bool LoggedOut { get; set; }

        [JsonProperty("message")]
        public string? Message { get; set; }
    }
}