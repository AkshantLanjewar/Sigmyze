using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class DatasetMap
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [Newtonsoft.Json.JsonIgnore]
        public string? Id { get; set; }

        [BsonElement("token")]
        [JsonProperty("token")]
        [JsonPropertyName("token")]
        public string? Token { get; set; }

        [BsonElement("quantaId")]
        [JsonProperty("quantaId")]
        [JsonPropertyName("quantaId")]
        public string? QuantaId { get; set; }
    }
}