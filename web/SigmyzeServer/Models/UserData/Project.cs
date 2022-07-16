using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SigmyzeServer.Models.Data;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.UserData
{
    public class Project
    {
        [BsonElement("project_id")]
        [JsonProperty("project_id")]
        public string? ProjectID { get; set; }

        [BsonElement("chart_name")]
        [JsonProperty("chart_name")]
        public string? ChartName { get; set; }

        [BsonElement("indicators")]
        [JsonProperty("indicators")]
        public List<ObjectIndicator> Indicators { get; set; }
    }
}