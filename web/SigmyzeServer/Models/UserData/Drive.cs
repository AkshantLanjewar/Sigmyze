using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.UserData
{
    public class Folder
    {
        [BsonElement("folder_name")]
        [JsonProperty("folder_name")]
        public string? FolderName { get; set; }

        [BsonElement("folder_id")]
        [JsonProperty("folder_id")]
        public string? FolderID { get; set; }

        [BsonElement("folders")]
        [JsonProperty("folders")]
        public List<Folder>? Folders { get; set; }

        [BsonElement("projects")]
        [JsonProperty("projects")]
        public List<Project>? Projects { get; set; }
    }

    public class Drive 
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string? Id { get; set; }

        [BsonElement("lunar_ID")]
        [JsonProperty("lunar_id")]
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