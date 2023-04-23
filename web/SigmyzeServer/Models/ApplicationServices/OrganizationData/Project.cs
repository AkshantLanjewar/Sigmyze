using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class ProjectView
    {
        [JsonProperty("project_id")]
        [BsonElement("project_id")]
        public string? ProjectId { get; set; }

        [JsonProperty("project_name")]
        [BsonElement("project_name")]
        public string? ProjectName { get; set; }

        [JsonProperty("project_type")]
        [BsonElement("project_type")]
        public string? ProjectType { get; set; }
    }

    public class ProjectData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [Newtonsoft.Json.JsonIgnore]
        public string? Id { get; set; }
        
        [BsonElement("project_id")]
        [JsonProperty("project_id")]
        [JsonPropertyName("project_id")]
        public string? ProjectId { get; set; }

        [BsonElement("project_name")]
        [JsonProperty("project_name")]
        [JsonPropertyName("project_name")]
        public string? ProjectName { get; set; }

        //NOTE: This field is used for user authentication, the backend has to verify whether or not 
        //the requested user can actually acesss this project
        [BsonElement("organization_id")]
        [Newtonsoft.Json.JsonIgnore]
        public string? OrganizationId { get; set; }
        
        //NOTE: In the ui framework, nodes refer to ui nodes, while splits include data
        [BsonElement("nodes")]
        [JsonProperty("splits")]
        [JsonPropertyName("splits")]
        public List<Node>? Nodes { get; set; }
        
        [BsonElement("documents")]
        [JsonProperty("documents")]
        [JsonPropertyName("documents")]
        public List<Document>? Documents { get; set; }
    }
}