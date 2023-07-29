using Newtonsoft.Json;
using MongoDB.Bson.Serialization.Attributes;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;

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
        [BsonElement("indicator_id")]
        public string IndicatorID { get; set; }

        [JsonProperty("indicator_fullname")]
        [BsonElement("indicator_fullname")]
        public string IndicatorFullname { get; set; }

        [JsonProperty("category")]
        [BsonElement("category")]
        public string Category { get; set; }
    }

    public class DatasetCacheObject
    {
        [JsonProperty("categorization")]
        public QuantaCategorization? Categorization { get; set; }

        [JsonProperty("dataset_name")]
        public string? DatasetName { get; set; }

        [JsonProperty("dataset_id")]
        public string? DatasetId { get; set; }

        [JsonProperty("dataset_description")]
        public string? DatasetDescription { get; set; }

        [JsonProperty("selectors")]
        public List<QuantaSelector>? Selectors { get; set; }

        [JsonProperty("textStore")]
        public Dictionary<string, string>? TextStore { get; set; }

        [JsonProperty("schemas")]
         public List<QuantaSchemas>? Schemas { get; set; }
    }

    public class PrimeResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg? Status { get; set; }

        [JsonProperty("shellObject")]
        public DatasetCacheObject? ShellObject { get; set; }
    }

    public class DatasetNodeEditorsResponse
    {
        [JsonProperty("status")]
        public APIStatusMsg? Status { get; set; }
        
        [JsonProperty("fetchEditor")]
        public QuantaEditorProject? FetchEditor { get; set; }

        [JsonProperty("updateEditor")]
        public QuantaEditorProject? UpdateEditor { get; set; }
    }
}