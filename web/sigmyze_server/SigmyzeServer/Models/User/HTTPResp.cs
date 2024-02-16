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

        [JsonProperty("verified")]
        public string? Verified { get; set; }

        [JsonProperty("role")]
        public string? Role { get; set; }

        [JsonIgnore]
        public string? RefreshToken { get; set; }

        [JsonProperty("lunarId")]
        public string? LunarId { get; set; }
    }

    public class RegisterResp
    {
        [JsonProperty("registered")]
        public bool Registered { get; set; }
        
        [JsonProperty("message")]
        public string? Message { get; set; }

        [JsonProperty("token")]
        public string? Token { get; set; }

        [JsonProperty("lunarId")]
        public string? LunarId { get; set; }
    }

    public class LogoutResp
    {
        [JsonProperty("logged_out")]
        public bool LoggedOut { get; set; }

        [JsonProperty("message")]
        public string? Message { get; set; }
    }

    public class VerifyResp
    {
        [JsonProperty("verified")]
        public bool Verified { get; set; }

        [JsonProperty("message")]
        public string? Message { get; set; }
        
        [JsonProperty("token")]
        public string Token { get; set; }
    }

    public class ResendResp
    {
        [JsonProperty("resent")]
        public bool Resent { get; set; }
    }

    public class UserDataResp
    {
        [JsonProperty("username")]
        public string Username { get; set; }

        [JsonProperty("email")]
        public string EMail { get; set; }

        [JsonProperty("verified")]
        public string Verified { get; set; }

        [JsonProperty("role")]
        public string Role { get; set; }
    }
}