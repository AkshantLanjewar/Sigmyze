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
    }

    public class ProjectData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string? Id { get; set; }
        
        [BsonElement("project_id")]
        public string? ProjectId { get; set; }

        //NOTE: This field is used for user authentication, the backend has to verify whether or not 
        //the requested user can actually acesss this project
        [BsonElement("organization_id")]
        public string? OrganizationId { get; set; }
        
        [BsonElement("nodes")]
        public List<Node>? Nodes { get; set; }
        
        [BsonElement("documents")]
        public List<Document>? Documents { get; set; }
    }
}