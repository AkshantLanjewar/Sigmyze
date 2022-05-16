using SendGrid;
using SendGrid.Helpers.Mail;

namespace SigmyzeServer.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmail(string token, string address, string name);
    }
    
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendVerificationEmail(string token, string address, string name)
        {
            string key            = _config["EmailKey"].ToString();
            SendGridClient client = new SendGridClient(key);

            EmailAddress from = new EmailAddress("sigmyze@gmail.com", "Sigmyze Platform");
            string subject    = "Your Verification Token";
            EmailAddress to   = new EmailAddress(address, name);

            string htmlContent = "";

            htmlContent +=  "<div>";
            htmlContent +=      $"<h1> Hello {name} </h1>";
            htmlContent +=      $"<h3>Here is your verification token </h3>";
            htmlContent +=  "</div>";

            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);
            await client.SendEmailAsync(msg);
        }
    }
}