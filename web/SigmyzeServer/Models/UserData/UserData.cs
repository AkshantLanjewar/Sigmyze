using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.UserData
{
    public class UserData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string? Id { get; set; }

        [BsonElement("lunar_ID")]
        [JsonProperty("lunar_id")]
        public string? Lunar_ID { get; set; }

        [BsonElement("projects")]
        [JsonProperty("projects")]
        public List<Project> Projects { get; set; }
    }
}