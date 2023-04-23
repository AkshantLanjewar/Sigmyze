using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class Organization
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string? Id { get; set; }

        [BsonElement("organization_id")]
        public string? OrganizationId { get; set; }

        [BsonElement("linked_drive_id")]
        [JsonIgnore]
        public string? LinkedDriveId { get; set; }

        [BsonElement("organization_name")]
        public string? OrganizationName { get; set; } 

        [BsonElement("users")]
        [JsonIgnore]
        public List<string>? Users { get; set; }
    }
}