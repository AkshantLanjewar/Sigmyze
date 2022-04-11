using Newtonsoft.Json;

namespace SigmyzeServer.Models
{
    public class DatasetsResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("datasets")]
        public List<string> Datasets { get; set; }
    }

    public class DatasetsCountryResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("countries")]
        public List<Country> Countries { get; set; }
    }

    public class DatasetsCategoryResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; }

        [JsonProperty("categories")]
        public List<string> Categories { get; set; }
    }

    public class DatasetsIndicatorResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; } 

        [JsonProperty("indicators")]
        public List<IndicatorName> Indicators { get; set; }
    }

    public class DatasetsCountryIndicatorResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg Status { get; set; } 

        [JsonProperty("iso3")]
        public string ISO3 { get; set; }

        [JsonProperty("country")]
        public string FullName { get; set; }

        [JsonProperty("ind3")]
        public string IND3 { get; set; }

        [JsonProperty("simpleName")]
        public string SimpleName { get; set; }

        [JsonProperty("data")]
        public List<IndicatorData> data { get; set; }
    }
}