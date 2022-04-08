using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

using SigmyzeServer.Services;

namespace SigmyzeServer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //create the base scrapers
            WEODataScraper weoScraper = new WEODataScraper();
            weoScraper.Run();

            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) 
        {
            return Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => {
                    webBuilder.UseStartup<Startup>();
                });
        }
    }
}