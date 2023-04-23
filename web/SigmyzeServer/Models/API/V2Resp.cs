using Newtonsoft.Json;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Models.API
{
    public class Dataset
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("logo")]
        public string Logo { get; set; } 
    }
    public class DatasetsResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("datasets")]
        public List<Dataset> Datasets { get; set; }
    }

    public class DatasetObjectResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("objects")]
        public List<DatasetObject> Objects { get; set; }
    }

    public class DatasetObjectIndicators
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("indicators")]
        public List<ObjectIndicator> Indicators { get; set; }
    }

    public class DatasetObjectIndicator 
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("indicator")]
        public DatasetIndicator Indicator { get; set; }
    }

    public class DatasetCategories
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("categories")]
        public List<string> Categories { get; set; }
    }
}