using Newtonsoft.Json;

namespace SigmyzeServer.Models.Data
{
    public class DatasetObject
    {
        [JsonProperty("object_id")]
        public string ObjectID { get; set; }

        [JsonProperty("object_fullname")]
        public string ObjectFullname { get; set; }

        [JsonProperty("object_logo")]
        public string ObjectLogo { get; set; }
    }

    public class ObjectIndicator 
    {
        [JsonProperty("indicator_id")]
        public string IndicatorID { get; set; }

        [JsonProperty("indicator_fullname")]
        public string IndicatorFullname { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; }
    }
}