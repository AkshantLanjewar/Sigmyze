using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using SigmyzeServer.Models.Maps;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/v{version:apiVersion}/datasets")]
    [ApiVersion("1.0")]
    public class MapsController : ControllerBase
    {
        private string URL_ROOT = "http://34.66.146.203:8080";
        private Root   GEO_JSON;
        private List<string> datasets;

        public MapsController()
        {
            string geo_loc = "./data/countries.geojson";
            string geo_val = Task.Run(async () => await ReadAllTextAsync(geo_loc)).Result;

            string metadata_loc = "./metadata";
            string?[] metadata_dirs = Directory.GetDirectories(metadata_loc).Select(Path.GetFileName).ToArray();
            List<string> datasets   = new List<string>(metadata_dirs!);
            this.datasets = datasets;

            Root geo_root = JsonConvert.DeserializeObject<Root>(geo_val)!;
            GEO_JSON      = geo_root;
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

        [HttpGet("{dataset}/{ind3}")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetMapIndicator(string dataset, string ind3)
        {
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

            return status;
        }
    }
}