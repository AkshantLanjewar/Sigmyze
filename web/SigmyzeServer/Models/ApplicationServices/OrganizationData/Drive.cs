using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class Drive
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string? Id { get; set; }
        
        [BsonElement("drive_id")]
        public string? DriveId { get; set; }

        [BsonElement("projects")]
        public List<ProjectView>? Projects { get; set; }

        [BsonElement("folders")]
        public List<Folder>? Folders { get; set; }
    }

    public class Folder
    {
        [BsonElement("folder_id")]
        public string? FolderId { get; set; }
        
        [BsonElement("folder_name")]
        public string? FolderName { get; set; }
        
        [BsonElement("projects")]
        public List<ProjectView>? Projects { get; set; }
        
        [BsonElement("folders")]
        public List<Folder>? Folders { get; set; }
    }
}