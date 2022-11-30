using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SigmyzeServer.Models.Data;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace SigmyzeServer.Models.UserData
{
    public class Project
    {
        [BsonElement("project_id")]
        [JsonProperty("project_id")]
        [JsonPropertyName("project_id")]
        public string? ProjectID { get; set; }

        [BsonElement("organization_id")]
        [JsonProperty("organization_id")]
        [JsonPropertyName("organization_id")]
        public string? OrganizationId { get; set; }

        [BsonElement("project_type")]
        [JsonProperty("project_type")]
        [JsonPropertyName("project_type")]
        public string? ProjectType { get; set; }

        [BsonElement("project_name")]
        [JsonProperty("project_name")]
        [JsonPropertyName("project_name")]
        public string? ProjectName { get; set; }

        [BsonElement("project_data")]
        [JsonProperty("project_data")]
        [JsonPropertyName("project_data")]
        public ProjectData? ProjectData { get; set; }
    }

    public class ProjectIndicator
    {
        [BsonElement("dataset")]
        [JsonProperty("dataset")]
        [JsonPropertyName("dataset")]
        public string? Dataset { get; set; }

        [BsonElement("indicator_id")]
        [JsonProperty("indicator_id")]
        [JsonPropertyName("indicator_id")]
        public string? IndicatorID { get; set; }

        [BsonElement("object_fullname")]
        [JsonProperty("object_fullname")]
        [JsonPropertyName("object_fullname")]
        public string? ObjectFullname { get; set; }

        [BsonElement("object_id")]
        [JsonProperty("object_id")]
        [JsonPropertyName("object_id")]
        public string? ObjectID { get; set; }
    }

    public class ProjectData
    {   
        [BsonElement("indicators")]
        [JsonProperty("indicators")]
        [JsonPropertyName("indicators")]
        public List<ProjectIndicator>? Indicators { get; set; }

        [BsonElement("documents")]
        [JsonProperty("documents")]
        [JsonPropertyName("documents")]
        public List<Document>? Documents { get; set; }
    }
}