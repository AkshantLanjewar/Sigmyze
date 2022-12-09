using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace SigmyzeServer.Models.Data
{
    public class DatasetCollection
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("object_id")]
        public string ObjectID { get; set; }
        
        [BsonElement("object_fullname")]
        public string ObjectFullname { get; set; }

        [BsonElement("object_logo")]
        public string ObjectLogo { get; set; } 

        [BsonElement("indicators")]
        public List<DatasetIndicator> Indicators { get; set; }

        [BsonElement("added_countries")]
        public List<string>? AddedObjects { get; set; }
    }

    public class DatasetIndicator
    {
        [BsonElement("indicator_id")]
        [JsonProperty("indicator_id")]
        [JsonPropertyName("indicator_id")]
        public string? IndicatorID { get; set; }

        [BsonElement("indicator_units")]
        [JsonProperty("indicator_units")]
        [JsonPropertyName("indicator_units")]
        public string? IndicatorUnits { get; set; }

        [BsonElement("indicator_name")]
        [JsonProperty("indicator_name")]
        [JsonPropertyName("indicator_name")]
        public string? IndicatorName { get; set; }

        [BsonElement("indicator_category")]
        [JsonProperty("indicator_category")]
        [JsonPropertyName("indicator_category")]
        public string? IndicatorCategory { get; set; }

        [BsonElement("indicator_data")]
        [JsonProperty("indicator_data")]
        [JsonPropertyName("indicator_data")]
        public List<DatasetData>? IndicatorData { get; set; }
    }

    public class DatasetData
    {
        [BsonElement("year")]
        [JsonProperty("year")]
        [JsonPropertyName("year")]
        public DateTime? Year { get; set; }

        [BsonElement("value")]
        [BsonRepresentation(BsonType.Double, AllowTruncation = true)]
        [JsonProperty("value")]
        [JsonPropertyName("value")]
        public float? Value { get; set; }

        [BsonElement("projection")]
        [JsonProperty("projection")]
        [JsonPropertyName("projection")]
        public bool? Projection { get; set; }
    }
}