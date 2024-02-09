using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices.Code;

public class QuantaSuppository
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [Newtonsoft.Json.JsonIgnore]
    public string? Id { get; set; }

    [Newtonsoft.Json.JsonIgnore]
    [BsonElement("quanta_id")]
    public string? QuantaId { get; set; }

    [BsonElement("items")]
    [JsonProperty("items")]
    [JsonPropertyName("items")]
    public List<SuppositoryItems>? Items { get; set; }
}

public class SuppositoryItems
{
    [BsonElement("short")]
    [JsonProperty("short")]
    [JsonPropertyName("short")]
    public string? Short { get; set; }

    [BsonElement("short_id")]
    [JsonProperty("short_id")]
    [JsonPropertyName("short_id")]
    public string? ShortId { get; set; }

    [BsonElement("code_id")]
    [JsonProperty("code_id")]
    [JsonPropertyName("code_id")]
    public string? CodeId { get; set; }
}