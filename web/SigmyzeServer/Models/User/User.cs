using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.User
{
    public class User
    {
        [BsonElement("username")]
        public string Username { get; set; }
        
        [BsonElement("password")]
        public string Password { get; set; }

        [BsonElement("lunar_ID")]
        public string Lunar_ID { get; set; }

        [BsonElement("email")]
        public string EMail { get; set; }

        [BsonElement("verified")]
        public bool Verified { get; set; }

        [BsonElement("verification_token")]
        public string VerificationToken { get; set; }

        [BsonElement("role")]
        public string Role { get; set; }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
    }
}