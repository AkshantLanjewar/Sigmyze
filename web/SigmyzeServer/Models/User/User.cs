using System.ComponentModel.DataAnnotations;

namespace SigmyzeServer.Models.User
{
    public class User
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Id { get; set; }
    }
}