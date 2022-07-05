using System.Net;
using SigmyzeServer.Models.API;
using Newtonsoft.Json;

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

        private void OutputFile(string loc, string val)
        {
            using (StreamWriter outputFile = new StreamWriter(loc))
            {
                outputFile.WriteLine(val);
            }
        }

        private void SetupDirectories()
        {
            string metadata_path = @"./metadata";
            if(!Directory.Exists(metadata_path))
                Directory.CreateDirectory(metadata_path);
            string weo_path = @"./metadata/weo";
            if(!Directory.Exists(weo_path))
                Directory.CreateDirectory(weo_path);
            string country_path = @"./metadata/weo/countries";
            if(!Directory.Exists(country_path))
                Directory.CreateDirectory(country_path);
        }

        //data functions
        private void TabulateCategories()
        {
            string categories_url  = URL_ROOT + @"/api/econdata/metricgroups/";
            string categories_resp = HTTP_Request(categories_url); 
            string CategoryPath    = @"./metadata/weo/categories.json";

            OutputFile(CategoryPath, categories_resp);            
        }

        private void TabulateCountry(Country country)
        {
            string indicator_content   = File.ReadAllText(@"./metadata/weo/indicators.json");
            List<IndicatorName> indicators = JsonConvert.DeserializeObject<List<IndicatorName>>(indicator_content);
            List<IndicatorName> validIndicators = new List<IndicatorName>();

            for(int i = 0; i < indicators.Count; i++)
            {
                IndicatorName indicator = indicators[i];
                bool validIndicator     = true;

                string country_ind_url          = URL_ROOT + @"/api/econdata/getMetricDataC/" + indicator.IND3 + "/" + country.ISO3 + "/";
                string country_ind_rep          = HTTP_Request(country_ind_url);
                CountryIndicator _indicatorData = JsonConvert.DeserializeObject<CountryIndicator>(country_ind_rep);

                Dictionary<string, string> _dataDict = _indicatorData.DataDict;
                List<string> _dataKeys               = new List<string>(_dataDict.Keys);
                List<IndicatorData> data             = new List<IndicatorData>();

                for(int z = 0; z < _dataKeys.Count; z++)
                {
                    string key = _dataKeys[z];
                    string val = _dataDict[key];

                    IndicatorData _data = new IndicatorData();
                    _data.Date  = key;
                    _data.Value = val;

                    if(_data.Value != null)
                        data.Add(_data);
                }

                //check if any null
                if(data.Count == 0 || data[0].Value == null)
                    validIndicator = false;
                if(validIndicator)
                    validIndicators.Add(indicator);
            }

            string countryLoc = @"./metadata/weo/countries/" + country.ISO3 + "_indicators.json";
            ValidCountryIndicators countryIndicators = new ValidCountryIndicators();
            countryIndicators.Country    = country;
            countryIndicators.Indicators = validIndicators;

            string json = JsonConvert.SerializeObject(countryIndicators, Formatting.Indented);
            OutputFile(countryLoc, json);
        }

        private void TabulateCountries()
        {
            string countries_url    = URL_ROOT + @"/api/econdata/countries/";
            string countries_rep    = HTTP_Request(countries_url);
            List<Country> countries = JsonConvert.DeserializeObject<List<Country>>(countries_rep);

            string json = JsonConvert.SerializeObject(countries, Formatting.Indented);
            OutputFile("./metadata/weo/countries.json", json);

            Parallel.For(0 ,countries.Count, count => {
                Country country = countries[count];
                LogInfo("Scraping " + country.ISO3);
                TabulateCountry(country);
            });
        }

        private void TabulateIndicators()
        {
            //read in the categories json
            string categories_content  = File.ReadAllText(@"./metadata/weo/categories.json");
            List<string> categories    = JsonConvert.DeserializeObject<List<string>>(categories_content);
            List<IndicatorName> indicators = new List<IndicatorName>();

            for(int i = 0; i < categories.Count; i++)
            {
                string category      = categories[i];

                string indicator_url                     = URL_ROOT + @"/api/econdata/metricsbygroup/" + category + @"/";
                string indicator_rep                     = HTTP_Request(indicator_url);
                Dictionary<string, string> indicator_obj = JsonConvert.DeserializeObject<Dictionary<string, string>>(indicator_rep);

                List<string> indicator_keys = new List<string>(indicator_obj.Keys);
                for(int x = 0; x < indicator_keys.Count; x++)
                {
                    string key = indicator_keys[x];
                    string val = indicator_obj[key];

                    IndicatorName _indicator = new IndicatorName();
                    _indicator.FullName  = val;
                    _indicator.IND3      = key;
                    _indicator.Category  = category;

                    if(val != null)
                        indicators.Add(_indicator);
                }
            }

            string json = JsonConvert.SerializeObject(indicators, Formatting.Indented);
            //output json to file
            string indicator_path = @"./metadata/weo/indicators.json";
            OutputFile(indicator_path, json);
        }

        public void Run()
        {
            SetupDirectories();

            //tabulate data
            TabulateCategories();
            TabulateIndicators();
            TabulateCountries();
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