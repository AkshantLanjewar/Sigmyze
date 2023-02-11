using System.Net;
using System.Net.Mail;
namespace SigmyzeServer.Services
{
    public interface IEmailService
    {
        void SendContactEmailSES(string name, string email, string subject, string msg);
        void SendVerificationEmailSES(string token, string address, string? name);
    }
    
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public void SendContactEmailSES(string name, string email, string subject, string msg)
        {
            string username = "AKIAYO437S56M4E6BAGL";
            string password = "BACLLPTVGF1EaHA1X/fPLbQwljV+okbIKptug6tOnQRG";
            string host = "email-smtp.us-east-1.amazonaws.com";
            int port = 587;

            string htmlContent = "";
            htmlContent +=  "<div>";
            htmlContent +=      $"<h5>Name {name} </h5>";
            htmlContent +=      $"<h5>E-Mail {email} </h5>";
            htmlContent +=      $"<h5>Subject {subject} </h5>";
            htmlContent +=      $"<p>{msg}</p>";
            htmlContent +=  "</div>";

            MailMessage message = new MailMessage();
            message.IsBodyHtml = true;
            message.From = new MailAddress("info@sigmyze.com", "Sigmyze Application");
            message.To.Add(new MailAddress("sigmyze@gmail.com"));
            message.Subject = "Contact Message";

            message.Body = htmlContent;

            using (var smtpClient = new SmtpClient(host, port))
            {
                smtpClient.Credentials = new NetworkCredential(username, password);
                smtpClient.EnableSsl = true;

                try
                {
                    smtpClient.Send(message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("The email was not sent.");
                    Console.WriteLine("Error message: " + ex.Message);
                }
            }
        }

        public void SendVerificationEmailSES(string token, string address, string? name)
        {
            string username = "AKIAYO437S56M4E6BAGL";
            string password = "BACLLPTVGF1EaHA1X/fPLbQwljV+okbIKptug6tOnQRG";
            string host = "email-smtp.us-east-1.amazonaws.com";
            int port = 587;

            string htmlContent = "";

            htmlContent +=  "<div>";
            htmlContent +=      $"<h1> Hello {name} </h1>";
            htmlContent +=      $"<h3>Here is your verification token {token} </h3>";
            htmlContent +=  "</div>";

            MailMessage message = new MailMessage();
            message.IsBodyHtml = true;
            message.From = new MailAddress("info@sigmyze.com", "Sigmyze Application");
            message.To.Add(new MailAddress(address));
            message.Subject = "Verification Token";
            message.Body = htmlContent;

            using (var smtpClient = new SmtpClient(host, port))
            {
                smtpClient.Credentials = new NetworkCredential(username, password);
                smtpClient.EnableSsl = true;

                try
                {
                    smtpClient.Send(message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("The email was not sent.");
                    Console.WriteLine("Error message: " + ex.Message);
                }
            }
        }
    }
}