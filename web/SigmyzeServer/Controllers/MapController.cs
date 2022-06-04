using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using SigmyzeServer.Models.Maps;
using System.Net;
using System.IO;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/v{version:apiVersion}/maps")]
    [ApiVersion("1.0")]
    public class MapsController : ControllerBase
    {
        private string URL_ROOT = "http://34.66.146.203:8080";
        private List<string> datasets;

        public MapsController()
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

        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> MapsControllerRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "Maps Endpoint Working";

            return await SerializeJSON(status);
        }

        [HttpGet("geojson")]
        [MapToApiVersion("1.0")]
        public async Task<FileStreamResult> GetGeoJSON()
        {
            string geo_loc = "./data/countries.geojson";
            var content    = new FileStream(geo_loc, FileMode.Open, FileAccess.Read, FileShare.Read);
            var resp       = File(content, "application/octet-stream");

            return resp;
        }

        [HttpGet("{dataset}/{ind3}")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetMapIndicator(string dataset, string ind3)
        {
            dataset = dataset.ToLower();
            ind3    = ind3.ToUpper();

            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "Map endpoint working";

            GetMapIndicatorResp resp = new GetMapIndicatorResp();
            resp.status              = status;

            //error checking
            APIStatusMsg datasetStatus = CheckDataset(dataset);
            if(datasetStatus.Error)
            {
                resp.status = datasetStatus;
                return await SerializeJSON(resp);
            }

            APIStatusMsg indicatorStatus = await CheckIndicator(dataset, ind3);
            if(indicatorStatus.Error)
            {
                resp.status = indicatorStatus;
                return await SerializeJSON(resp);
            }
            
            string country_str       = await ReadAllTextAsync($"./metadata/{dataset}/countries.json");
            List<Country> countries  = JsonConvert.DeserializeObject<List<Country>>(country_str)!;
            List<EconomicData> p_out = new List<EconomicData>();

            Parallel.For(0, countries.Count, count => {
                try
                {
                    Country country = countries[count];

                    string req_url  = $"{URL_ROOT}/api/econdata/getMetricDataC/{ind3}/{country.ISO3}/";
                    string req_rep  = Task.Run(async () => await HTTP_Request(req_url)).Result;
                    CountryIndicator c_indicator = JsonConvert.DeserializeObject<CountryIndicator>(req_rep)!;
                    List<IndicatorData> data     = new List<IndicatorData>();
                    Dictionary<string, string> dataDict = c_indicator.DataDict;
                    List<string> keys                   = new List<string>(dataDict.Keys);
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
                

                    float value          = float.Parse(data[data.Count - 1].Value);
                    EconomicData geoData = new EconomicData();
                    
                    geoData.IND3 = ind3;
                    geoData.ISO3 = country.ISO3;
                    geoData.VAL  = value;
                    p_out.Add(geoData);
                }
                catch (System.Exception)
                {
                    
                }
            });

            resp.data = p_out;
            return await SerializeJSON(resp);
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

        private async Task<APIStatusMsg> CheckIndicator(string dataset, string ind3)
        {
            APIStatusMsg status  = new APIStatusMsg();
            string indicator_loc = $"./metadata/{dataset}/indicators.json";
            string indicator_str = await ReadAllTextAsync(indicator_loc);

            List<IndicatorName> indicators = JsonConvert.DeserializeObject<List<IndicatorName>>(indicator_str)!;
            bool check = true;
            for(int i = 0; i < indicators.Count; i++)
            {
                IndicatorName indicator = indicators[i];
                if(indicator.IND3 == ind3)
                    check = false;
            }

            if(check)
            {
                status.Error = true;
                status.MSG   = $"INVALID indicator";
            }

            return status;
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
    }
}