using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.User
{
    public class User
    {
        [BsonElement("username")]
        public string? Username { get; set; }
        
        [BsonElement("password")]
        public string? Password { get; set; }

        [BsonElement("salt")]
        public string? Salt { get; set; }

        [BsonElement("lunar_ID")]
        public string? LunarId { get; set; }
        
        [BsonElement("organizations")]
        public List<string>? Organizations { get; set; }

        [BsonElement("email")]
        public string? EMail { get; set; }

        [BsonElement("verified")]
        public string? Verified { get; set; }

        [BsonElement("verification_token")]
        public string? VerificationToken { get; set; }

        [BsonElement("role")]
        public string? Role { get; set; }

        [BsonElement("refresh_token")]
        public RefreshToken? RefreshToken { get; set; }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
    }
}