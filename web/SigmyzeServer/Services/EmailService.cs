using System.Net.Mail;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace SigmyzeServer.Services
{
    public interface IEmailService
    {
        Task SendVerificationEmail(string token, string address, string? name);
        void SendVerificationEmailSES(string token, string address, string? name);
    }
    
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendVerificationEmail(string token, string address, string? name)
        {
            string key            = _config["EmailKey"].ToString();
            SendGridClient client = new SendGridClient(key);

            EmailAddress from = new EmailAddress("sigmyze@gmail.com", "Sigmyze Platform");
            string subject    = "Your Verification Token";
            EmailAddress to   = new EmailAddress(address, name);

            string htmlContent = "";

            htmlContent +=  "<div>";
            htmlContent +=      $"<h1> Hello {name} </h1>";
            htmlContent +=      $"<h3>Here is your verification token {token} </h3>";
            htmlContent +=  "</div>";

            var msg = MailHelper.CreateSingleEmail(from, to, subject, "", htmlContent);
            await client.SendEmailAsync(msg);
        }

        public void SendVerificationEmailSES(string token, string address, string? name)
        {
            string username = "AKIAYO437S56M4E6BAGL";
            string password = "BACLLPTVGF1EaHA1X/fPLbQwljV+okbIKptug6tOnQRG";
            string host = "email-smtp.us-east-1.amazonaws.com";
            int port = 25;

            string htmlContent = "";

            htmlContent +=  "<div>";
            htmlContent +=      $"<h1> Hello {name} </h1>";
            htmlContent +=      $"<h3>Here is your verification token {token} </h3>";
            htmlContent +=  "</div>";

            using(var client = new System.Net.Mail.SmtpClient(host, port))
            {
                client.Credentials = new System.Net.NetworkCredential(username, password);
                client.EnableSsl = true;
                
                MailMessage msg = new MailMessage(
                    "info@sigmyze.com",
                    address,
                    "Verification Email",
                    htmlContent
                );

                msg.IsBodyHtml = true;
                client.Send(msg);
            }
        }
    }
}