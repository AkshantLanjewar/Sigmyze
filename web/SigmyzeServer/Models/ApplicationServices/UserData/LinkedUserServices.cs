using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class UserServiceIndex
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string? Id { get; set; }

        [BsonElement("user_id")]
        public string? UserId { get; set; }

        [BsonElement("linked_organizations")]
        public List<LinkedOrganization>? LinkedOrganizations { get; set; }
    }
}