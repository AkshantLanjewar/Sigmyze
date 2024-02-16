using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class Drive
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string? Id { get; set; }
        
        [JsonIgnore]
        [BsonElement("drive_id")]
        public string? DriveId { get; set; }

        [JsonProperty("projects")]
        [BsonElement("projects")]
        public List<ProjectView>? Projects { get; set; }

        [JsonProperty("folders")]
        [BsonElement("folders")]
        public List<Folder>? Folders { get; set; }
    }

    public class Folder
    {
        [JsonProperty("folder_id")]
        [BsonElement("folder_id")]
        public string? FolderId { get; set; }
        
        [JsonProperty("folder_name")]
        [BsonElement("folder_name")]
        public string? FolderName { get; set; }
        
        [JsonProperty("projects")]
        [BsonElement("projects")]
        public List<ProjectView>? Projects { get; set; }
        
        [JsonProperty("folders")]
        [BsonElement("folders")]
        public List<Folder>? Folders { get; set; }
    }
}