using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using SigmyzeServer.Models.Maps;
using SigmyzeServer.Services;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/v{version:apiVersion}/maps")]
    [ApiVersion("1.0")]
    public class MapsController : ControllerBase
    {
        private string URL_ROOT = "http://34.66.146.203:8080";
        private List<Dataset> datasets;
        private List<string> _datasetsStr;
        private readonly IDatasetMongoORM _datasetMongoORM;

        public MapsController(IDatasetMongoORM datasetMongoORM)
        {
            _datasetMongoORM = datasetMongoORM;
            datasets         = _datasetMongoORM.GetDatasets();
            _datasetsStr     = new List<string>();

            for(int i = 0; i < datasets.Count; i++)
                _datasetsStr.Add(datasets[i].Name);
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

        [HttpGet("{dataset}/{indicator_id}")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetMapIndicator(string dataset, string indicator_id)
        {
            dataset                  = dataset.ToUpper();
            indicator_id             = indicator_id.ToUpper();
            GetMapIndicatorResp resp = new GetMapIndicatorResp();
            resp.status              = checkDataset(dataset);

            List<string> objects = await _datasetMongoORM.ProcessedObjects(dataset);
            List<EconomicData> p_out    = new List<EconomicData>();

            Parallel.For(0, objects.Count, async count => {
                string obj_id              = objects[count];
                DatasetIndicator indicator = await _datasetMongoORM.GetIndicator(dataset, obj_id, indicator_id);

                if(indicator.IndicatorData.Count > 0)
                {
                    float value          = indicator.IndicatorData[indicator.IndicatorData.Count - 1].Value ?? 0;
                    EconomicData geoData = new EconomicData();
                    geoData.IndicatorID  = indicator_id;
                    geoData.ObjectID     = obj_id;
                    geoData.VAL          = value;

                    p_out.Add(geoData);
                }
            });

            resp.data = p_out;
            return await SerializeJSON(resp);
        }

        private APIStatusMsg checkDataset(string dataset)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "Working";
            
            if(!_datasetsStr.Contains(dataset))
            {
                status.Error = true;
                status.MSG   = "Dataset DNE";
            }

            return status;
        }

        private async Task<IActionResult> SerializeJSON(object data)
        {
            string content = await Task.Run(() => JsonConvert.SerializeObject(data));
            return Content(
                content,
                "application/json"
            );
        }
    }
}