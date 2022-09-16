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

        [BsonElement("project_type")]
        [JsonProperty("project_type")]
        public string? ProjectType { get; set; }

        [BsonElement("project_name")]
        [JsonProperty("project_name")]
        public string? ProjectName { get; set; }

        [BsonElement("project_data")]
        [JsonProperty("project_data")]
        public ProjectData? ProjectData { get; set; }
    }

    public class ProjectData
    {   
        [BsonElement("indicators")]
        [JsonProperty("indicators")]
        public List<DatasetIndicator>? Indicators { get; set; }

        [BsonElement("documents")]
        [JsonProperty("documents")]
        public List<Document>? Documents { get; set; }
    }
}