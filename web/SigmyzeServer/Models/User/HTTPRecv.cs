using System.Text.Json.Serialization;

namespace SigmyzeServer.Models.User
{
    public class LoginPost
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterPost
    {
        public string Email { get; set; }
        public string? Username { get; set; }
        public string Password { get; set; }
    }

    public class VerifyPost
    {
        public string Token { get; set; }
        public string Code { get; set; }
    }

    public class ResendPost
    {
        public string Token { get; set; }
    }

    public class MessagePost
    {
        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("email")]
        public string EMail { get; set; }

        [JsonPropertyName("subject")]
        public string Subject { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }
    }
}