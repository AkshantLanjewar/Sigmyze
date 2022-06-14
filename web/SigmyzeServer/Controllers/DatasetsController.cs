using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using SigmyzeServer.Services;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/v{version:apiVersion}/datasets")]
    [ApiVersion("1.0")]
    public class DatasetsController : ControllerBase
    {
        private List<string> _datasets;
        private readonly IDatasetMongoORM _datasetMongoORM;

        public DatasetsController(IDatasetMongoORM datasetMongoORM)
        {
            _datasetMongoORM = datasetMongoORM;
            _datasets        = _datasetMongoORM.GetDatasets();
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
            resp.Datasets         = this._datasets;
            
            return await SerializeJSON(resp);
        }

        [HttpGet("{dataset}/countries")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetDatasetCountries(string dataset)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error    = true;
            status.MSG      = "API Version Phased Out";

            return await SerializeJSON(status);
        }

        [HttpGet("{dataset}/objects")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> GetDatasetCountriesV2(string dataset)
        {
            dataset                    = dataset.ToUpper();
            DatasetObjectResponse resp = new DatasetObjectResponse();
            resp.Status                = await checkDataset(dataset);
            if(resp.Status.Error)
                return await SerializeJSON(resp);

            List<DatasetObject> objects = _datasetMongoORM.ProcessedObjects(dataset);
            resp.Objects                = objects;
            return await SerializeJSON(resp);
        }

        [HttpGet("{dataset}/categories")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetDatasetCategories(string dataset)
        {
            dataset                = dataset.ToUpper();
            DatasetCategories resp = new DatasetCategories();
            resp.Status = await checkDataset(dataset);
            if(resp.Status.Error)
                return await SerializeJSON(resp);

            resp.Categories = _datasetMongoORM.Categories(dataset);

            return await SerializeJSON(resp);
        }

        [HttpGet("{dataset}/countries/{country}/indicators")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetCountryIndicators(string dataset, string country)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error    = true;
            status.MSG      = "API Version Phased Out";

            return await SerializeJSON(status);
        }

        [HttpGet("{dataset}/objects/{object_id}/indicators")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> GetObjectIndicators(string dataset, string object_id)
        {
            dataset   = dataset.ToUpper();
            object_id = object_id.ToUpper();

            DatasetObjectIndicators resp = new DatasetObjectIndicators();

            resp.Status = await checkDataset(dataset);
            if(resp.Status.Error)
                return await SerializeJSON(resp);
            resp.Status = await checkObject(dataset, object_id);
            if(resp.Status.Error)
                return await SerializeJSON(resp);

            DatasetCollection obj                 = _datasetMongoORM.GetObject(dataset, object_id);
            List<DatasetIndicator> obj_indicators = obj.Indicators;
            List<ObjectIndicator>  _objIndicators = new List<ObjectIndicator>();

            for(int i = 0; i < obj_indicators.Count; i++)
            {
                DatasetIndicator _indicator = obj_indicators[i];
                ObjectIndicator indicator   = new ObjectIndicator();

                indicator.Category          = "All";
                indicator.IndicatorFullname = _indicator.IndicatorName;
                indicator.IndicatorID       = _indicator.IndicatorID;
                _objIndicators.Add(indicator);
            }

            resp.Indicators = _objIndicators;
            return await SerializeJSON(resp);
        }

        [HttpGet("{dataset}/countries/{country}/indicators/{indicator}")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetCountryIndicator(string dataset, string country, string indicator)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error    = true;
            status.MSG      = "API Version Phased Out";

            return await SerializeJSON(status);
        }

        [HttpGet("{dataset}/objects/{object_id}/indicators/{indicator_id}")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> GetObjectIndicator(string dataset, string object_id, string indicator_id)
        {
            dataset      = dataset.ToUpper();
            object_id    = object_id.ToUpper();
            indicator_id = indicator_id.ToUpper();

            DatasetObjectIndicator resp = new DatasetObjectIndicator();
            
            resp.Status = await checkDataset(dataset);
            if(resp.Status.Error)
                return await SerializeJSON(resp);
            resp.Status = await checkObject(dataset, object_id);
            if(resp.Status.Error)
                return await SerializeJSON(resp);

            DatasetIndicator indicator = _datasetMongoORM.GetIndicator(dataset, object_id, indicator_id);
            resp.Indicator             = indicator;
            return await SerializeJSON(resp);
        }

        private async Task<IActionResult> SerializeJSON(object data)
        {
            string content = await Task.Run(() => JsonConvert.SerializeObject(data));
            return Content(
                content,
                "application/json"
            );
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

        private async Task<APIStatusMsg> checkDataset(string dataset)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error        = false;
            status.MSG          = "Working";
            
            if(!_datasets.Contains(dataset))
            {
                status.Error = true;
                status.MSG   = "Dataset DNE";
            }

            return status;
        }

        private async Task<APIStatusMsg> checkObject(string dataset, string object_id)
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "Working";

            List<DatasetObject> objects = _datasetMongoORM.ProcessedObjects(dataset);
            int object_index            = objects.FindIndex(x => x.ObjectID == object_id);
            if(object_index < 0)
            {
                status.Error = false;
                status.MSG   = "Object DNE";
            }

            return status;
        }
    }
}