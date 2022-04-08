using System.IO;
using System.Net;

namespace SigmyzeServer.Services
{
    public class WEODataScraper
    {
        private string URL_ROOT = "http://34.66.146.203:8080";
        private bool   USE_LOG  = false;
        private readonly ILogger<WEODataService> _logger;

        public WEODataScraper()
        {

        }

        public WEODataScraper(ILogger<WEODataService> logger)
        {
            USE_LOG = true;
            _logger = logger;
        }

        private string HTTP_Request(string url)
        {
            string content = "";
            WebRequest request   = WebRequest.Create(url);
            WebResponse response = request.GetResponse();

            using (Stream dataStream = response.GetResponseStream())
            {
                StreamReader reader = new StreamReader(dataStream);
                content = reader.ReadToEnd();
            } 

            response.Close();
            return content;
        }

        private void LogInfo(string msg)
        {
            if(USE_LOG)
                _logger.LogInformation(msg);
            if(!USE_LOG)
                Console.WriteLine(msg);
        }

        private void SetupDirectories()
        {
            string metadata_path = @"./metadata";
            if(!Directory.Exists(metadata_path))
                Directory.CreateDirectory(metadata_path);
            string weo_path = @"./metadata/weo";
            if(!Directory.Exists(weo_path))
                Directory.CreateDirectory(weo_path);
        }

        //data functions
        private void TabulateCategories()
        {
            string categories_url  = URL_ROOT + @"/api/econdata/metricgroups/";
            string categories_resp = HTTP_Request(categories_url); 
            
        }

        private void TabulateCountries()
        {

        }

        private void TabulateIndicators()
        {

        }

        public void Run()
        {
            SetupDirectories();

            //tabulate data
            TabulateCategories();
        }
    }

    public class WEODataService : CronJobService
    {
        private readonly ILogger<WEODataService> _logger;

        public WEODataService(IScheduleConfig<WEODataService> config, ILogger<WEODataService> logger)
            : base(config.CronExpression, config.TimeZoneInfo)
        {
            _logger = logger;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("WEO Data Service Starting");
            return base.StartAsync(cancellationToken);
        }

        public override Task DoWork(CancellationToken cancellationToken)
        {
            _logger.LogInformation($"{DateTime.Now:hh:mm:ss} WEO Data Service is working");
            WEODataScraper _scraper = new WEODataScraper(_logger);
            _scraper.Run();

            return Task.CompletedTask;
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("WEO Data Service is stopping");
            return base.StopAsync(cancellationToken);
        }
    }
}