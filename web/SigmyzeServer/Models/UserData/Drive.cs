using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SigmyzeServer.Models.Data;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace SigmyzeServer.Models.UserData
{
    public class Folder
    {
        [BsonElement("folder_name")]
        [JsonProperty("folder_name")]
        [JsonPropertyName("folder_name")]
        public string? FolderName { get; set; }

        [BsonElement("folder_id")]
        [JsonProperty("folder_id")]
        [JsonPropertyName("folder_id")]
        public string? FolderID { get; set; }

        [BsonElement("starred")]
        [Newtonsoft.Json.JsonIgnore]
        public string? Starred { get; set; }

        [BsonElement("folders")]
        [JsonProperty("folders")]
        [JsonPropertyName("folders")]
        public List<Folder>? Folders { get; set; }

        [BsonElement("projects")]
        [JsonProperty("projects")]
        [JsonPropertyName("projects")]
        public List<Project>? Projects { get; set; }
    }

    public class Drive 
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [Newtonsoft.Json.JsonIgnore]
        public string? Id { get; set; }

        [BsonElement("lunar_ID")]
        [JsonProperty("lunar_id")]
        [Newtonsoft.Json.JsonIgnore]
        public string Lunar_ID { get; set; }

        [BsonElement("folders")]
        [JsonProperty("folders")]
        public List<Folder>? Folders { get; set; }

        [BsonElement("recently_edited")]
        [JsonProperty("recently_edited")]
        public List<Project>? RecentlyEditedProjects { get; set; }

        [BsonElement("projects")]
        [JsonProperty("projects")]
        public List<Project>? Projects { get; set; }
    }
}