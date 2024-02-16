using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class UserApplicationServiceRoles
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("lunar_id")]
        public string? LunarId { get; set; }
        
        [BsonElement("linked_organizations")]
        public List<string>? LinkedOrganizations { get; set; }
    }
}