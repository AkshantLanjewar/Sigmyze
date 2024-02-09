using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices.UserData
{
    public class GetIndicatorsQuery
    {
        [BsonElement("indicators")]
        [JsonProperty("indicators")]
        public List<QuantaIndicator>? Indicators { get; set; }
    }

    public class GetIndicatorsLength
    {
        [BsonElement("_id")]
        [Newtonsoft.Json.JsonIgnore]
        public int? Id { get; set; }

        [BsonElement("indicators_length")]
        [JsonProperty("indicators_length")]
        public int? IndicatorsLength { get; set; }
    }

    public class GetProjectDataQuery
    {
        [BsonElement("project_id")]
        [JsonProperty("project_id")]
        public string? ProjectId { get; set; }

        [BsonElement("project_name")]
        [JsonProperty("project_name")]
        public string? ProjectName { get; set; }

        [BsonElement("project_data")]
        [JsonProperty("project_data")]
        public QuantaProjectData? ProjectData { get; set; }
    }
}