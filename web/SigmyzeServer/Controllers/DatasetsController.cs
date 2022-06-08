using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Net;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/v{version:apiVersion}/datasets")]
    [ApiVersion("1.0")]
    public class DatasetsController : ControllerBase
    {
        private List<string> datasets;
        private string URL_ROOT = "http://34.66.146.203:8080";

        public DatasetsController()
        {
            string metadata_loc = "./metadata";
            string?[] metadata_dirs = Directory.GetDirectories(metadata_loc).Select(Path.GetFileName).ToArray();
            List<string> datasets   = new List<string>(metadata_dirs!);

            this.datasets = datasets;
        }

        private async Task<IActionResult> SerializeJSON(object data)
        {
            string content = await Task.Run(() => JsonConvert.SerializeObject(data));
            return Content(
                content,
                "application/json"
            );
        }

        //checks
        private APIStatusMsg CheckDataset(string dataset)
        {
            APIStatusMsg status = new APIStatusMsg();
            string check = this.datasets.FirstOrDefault(x => x == dataset);
            if(check == null) 
            {
                status.Error = true;
                status.MSG   = "INVALID dataset";
            }

            return status;
        }

        private APIStatusMsg CheckCountry(string dataset, string iso3)
        {
            APIStatusMsg status = new APIStatusMsg();
            string country_loc  = $"./metadata/{dataset}/countries/";
            string?[] country_files = Directory.GetFiles(country_loc, "*.json").Select(Path.GetFileName).Select(s => s.Replace("_indicators.json", "")).ToArray();
            string check = country_files.FirstOrDefault(x => x == iso3);
            if(check == null)
            {
                status.Error = true;
                status.MSG   = "INVALID country";
            }

            return status;
        }

        private async Task<APIStatusMsg> CheckIndicator(string dataset, string iso3, string indicator)
        {
            APIStatusMsg status = new APIStatusMsg();
            string country_loc = $"./metadata/{dataset}/countries/{iso3}_indicators.json";
            string country_str = await ReadAllTextAsync(country_loc);

            ValidCountryIndicators validIndicators = JsonConvert.DeserializeObject<ValidCountryIndicators>(country_str);
            bool check = true;
            for(int i = 0; i < validIndicators.Indicators.Count; i++)
            {
                IndicatorName indicator_obj = validIndicators.Indicators[i];
                if(indicator_obj.IND3 == indicator)
                    check = false;
            }

            if(check)
            {
                status.Error = true;
                status.MSG   = $"INVALID indicator";
            }

            return status;
        }

        private static async Task<string> ReadAllTextAsync(string filePath)
        {
            var stringBuilder = new StringBuilder();
            using (var fileStream = System.IO.File.OpenRead(filePath))
            using (var streamReader = new StreamReader(fileStream))
            {
                string line = await streamReader.ReadLineAsync();
                while(line != null)
                {
                    stringBuilder.Append(line);
                    line = await streamReader.ReadLineAsync();
                }

                return stringBuilder.ToString();
            }
        }

        private async Task<string> HTTP_Request(string url)
        {
            string val = await Task.Run<string>(() => 
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
            });
            
            return val;
        }

        //endpoints
        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> DataControllerRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "/datasets endpoint working";

            DatasetsResponse resp = new DatasetsResponse();
            resp.Status           = status;
            resp.Datasets         = this.datasets;
            
            return await SerializeJSON(resp);
        }

        [HttpGet("{dataset}/countries")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetDatasetCountries(string dataset)
        {
            dataset = dataset.ToLower();
            DatasetsCountryResponse response = new DatasetsCountryResponse();

            APIStatusMsg status = new APIStatusMsg();
            status.Error    = false;
            status.MSG      = "Data Endpoint working";
            response.Status = status;

            APIStatusMsg datasetStatus = CheckDataset(dataset);
            if(datasetStatus.Error)
            {
                response.Status = datasetStatus;
                return await SerializeJSON(response);
            }    
            
            string country_loc       = $"./metadata/{dataset}/countries.json";
            string country_str       = await ReadAllTextAsync(country_loc);
            List<Country> countries  = JsonConvert.DeserializeObject<List<Country>>(country_str);
            response.Countries       = countries;

            return await SerializeJSON(response);
        }

        [HttpGet("{dataset}/categories")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetDatasetCategories(string dataset)
        {
            dataset = dataset.ToLower();
            DatasetsCategoryResponse response = new DatasetsCategoryResponse();

            APIStatusMsg status = new APIStatusMsg();
            status.Error    = false;
            status.MSG      = "Dataset Categories endpoint is working";
            response.Status = status;

            APIStatusMsg datasetStatus = CheckDataset(dataset);
            if(datasetStatus.Error)
            {
                response.Status = datasetStatus;
                return await SerializeJSON(response);
            }

            string category_loc = $"./metadata/{dataset}/categories.json";
            string category_str = await ReadAllTextAsync(category_loc);

            List<string> categories = JsonConvert.DeserializeObject<List<string>>(category_str);
            for(int i = 0; i < categories.Count; i++)
                categories[i] = categories[i].Replace(dataset.ToUpper(), "");
            response.Categories = categories;

            return await SerializeJSON(response);
        }

        [HttpGet("{dataset}/countries/{country}/indicators")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetCountryIndicators(string dataset, string country)
        {
            dataset = dataset.ToLower();
            country = country.ToUpper();
            DatasetsIndicatorResponse response = new DatasetsIndicatorResponse();

            APIStatusMsg status = new APIStatusMsg();
            status.Error    = false;
            status.MSG      = "Country Indicators Endpoint working";
            response.Status = status;

            APIStatusMsg datasetStatus = CheckDataset(dataset);
            if(datasetStatus.Error)
            {
                response.Status = datasetStatus;
                return await SerializeJSON(response);
            }

            APIStatusMsg countryStatus = CheckCountry(dataset, country);
            if(countryStatus.Error)
            {
                response.Status = countryStatus;
                return await SerializeJSON(response);
            }

            string country_loc = $"./metadata/{dataset}/countries/{country}_indicators.json";
            string country_str = await ReadAllTextAsync(country_loc);
            ValidCountryIndicators valid_indicators = JsonConvert.DeserializeObject<ValidCountryIndicators>(country_str);
            response.Indicators = valid_indicators.Indicators; 

            return await SerializeJSON(response);
        }

        [HttpGet("{dataset}/countries/{country}/indicators/{indicator}")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetCountryIndicator(string dataset, string country, string indicator)
        {
            dataset   = dataset.ToLower();
            country   = country.ToUpper();
            indicator = indicator.ToUpper();
            DatasetsCountryIndicatorResponse response = new DatasetsCountryIndicatorResponse();

            APIStatusMsg status = new APIStatusMsg();
            status.Error    = false;
            status.MSG      = "Country Indicator Endpoint working";
            response.Status = status;
            
            APIStatusMsg datasetStatus = CheckDataset(dataset);
            if(datasetStatus.Error)
            {
                response.Status = datasetStatus;
                return await SerializeJSON(response);
            }

            APIStatusMsg countryStatus = CheckCountry(dataset, country);
            if(countryStatus.Error)
            {
                response.Status = countryStatus;
                return await SerializeJSON(response);
            }

            APIStatusMsg indicatorStatus = await CheckIndicator(dataset, country, indicator);
            if(indicatorStatus.Error)
            {
                response.Status = countryStatus;
                return await SerializeJSON(response);
            }

            string indicator_url         = $"{URL_ROOT}/api/econdata/getMetricDataC/{indicator}/{country}/";
            string indicator_rep         = await HTTP_Request(indicator_url);
            CountryIndicator c_indicator = JsonConvert.DeserializeObject<CountryIndicator>(indicator_rep);

            //now convert dict to list
            Dictionary<string, string> dataDict = c_indicator.DataDict;
            List<string> keys                   = new List<string>(dataDict.Keys);
            List<IndicatorData> data     = new List<IndicatorData>();
            for(int i = 0; i < keys.Count; i++)
            {
                string key = keys[i];
                string val = dataDict[key];

                IndicatorData _data = new IndicatorData();
                _data.Date  = key;
                _data.Value = val;
                if(_data.Value != null)
                    data.Add(_data);
            }

            response.ISO3       = country;
            response.FullName   = c_indicator.FullName;
            response.IND3       = indicator;
            response.SimpleName = c_indicator.SimpleName;
            response.data       = data; 

            return await SerializeJSON(response);
        }
    }
}