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
}