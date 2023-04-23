using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class IIndicator
    {
        [BsonElement("dataset")]
        [JsonProperty("dataset")]
        [JsonPropertyName("dataset")]
        public string? Dataset { get; set; }
        
        [BsonElement("object")]
        [JsonProperty("object")]
        [JsonPropertyName("object")]
        public IDatasetObject? Object { get; set; }
        
        [BsonElement("indicator")]
        [JsonProperty("indicator")]
        [JsonPropertyName("indicator")]
        public IObjectIndicator? Indicator { get; set; }
    }

    public class IDatasetObject
    {
        [BsonElement("object_id")]
        [JsonProperty("object_id")]
        [JsonPropertyName("object_id")]
        public string? ObjectId { get; set; }
        
        [BsonElement("object_fullname")]
        [JsonProperty("object_fullname")]
        [JsonPropertyName("object_fullname")]
        public string? ObjectFullname { get; set; }
        
        [BsonIgnore]
        public string? ObjectLogo { get; set; }
    }

    public class IObjectIndicator
    {
        [BsonElement("indicator_id")]
        [JsonProperty("indicator_id")]
        [JsonPropertyName("indicator_id")]
        public string? IndicatorId { get; set; }
        
        [BsonElement("indicator_fullname")]
        [JsonProperty("indicator_fullname")]
        [JsonPropertyName("indicator_fullname")]
        public string? IndicatorFullname { get; set; }
        
        [BsonElement("category")]
        [JsonProperty("category")]
        [JsonPropertyName("category")]
        public string? Category { get; set; }
    }

    public class IChartSettings
    {
        [BsonElement("indicatorSettings")]
        [JsonProperty("indicatorSettings")]
        [JsonPropertyName("indicatorSettings")]
        public List<IIndicatorSetting>? IndicatorSettings { get; set; }
    }

    public class IIndicatorSetting
    {
        [BsonElement("indicator")]
        [JsonProperty("indicator")]
        [JsonPropertyName("indicator")]
        public IIndicator? Indicator { get; set; }
        
        [BsonElement("lineColor")]
        [JsonProperty("lineColor")]
        [JsonPropertyName("lineColor")]
        public string? LineColor { get; set; }
    }

    public class IGlobalChartSettings
    {   
        [BsonElement("chartTitle")]
        [JsonProperty("chartTitle")]
        [JsonPropertyName("chartTitle")]
        public string? ChartTitle { get; set; }
    }
}