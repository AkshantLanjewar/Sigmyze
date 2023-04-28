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

    public class GetProjectDataQuery
    {
        [BsonElement("project_id")]
        public string? ProjectId { get; set; }

        [BsonElement("project_name")]
        public string? ProjectName { get; set; }

        [BsonElement("project_data")]
        public QuantaProjectData? ProjectData { get; set; }
    }
}