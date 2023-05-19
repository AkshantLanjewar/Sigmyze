using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.User
{
    public class RefreshToken
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("token")]
        public string? Token { get; set; }

        [BsonElement("expires")]
        public DateTime Expires { get; set; }

        [BsonElement("created")]
        public DateTime Created { get; set; }

        [BsonElement("createdByIp")]
        public string? CreatedByIp { get; set; }

        [BsonElement("revoked")]
        public DateTime? Revoked { get; set; }

        [BsonElement("revokedByIp")]
        public string? RevokedByIp { get; set; }

        [BsonElement("replacedByToken")]
        public string? ReplacedByToken { get; set; } 

        public bool IsExpired => DateTime.UtcNow >= Expires;
        public bool IsActive => Revoked == null && !IsExpired;
    }
}