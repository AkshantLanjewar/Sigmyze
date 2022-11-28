using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SigmyzeServer.Models.Organizations;

namespace SigmyzeServer.Models.Polis;

public class Polis
{
    [BsonId]
	[BsonRepresentation(BsonType.ObjectId)]
	[System.Text.Json.Serialization.JsonIgnore]
	[Newtonsoft.Json.JsonIgnore]
    public string? Id { get; set; }

    [BsonElement("polis_id")]
    [JsonProperty("polis_id")]
    [JsonPropertyName("polis_id")]
    public string? PolisId { get; set; }

    [BsonElement("organization_id")]
    [JsonProperty("organization_id")]
    [JsonPropertyName("organization_id")]
    [Newtonsoft.Json.JsonIgnore]
    public string? OrganizationId { get; set; }

    [BsonElement("active_layout")]
    [JsonProperty("active_layout")]
    [JsonPropertyName("active_layout")]
    public Layout? ActiveLayout { get; set; }

    [BsonElement("data")]
    [JsonProperty("data")]
    [JsonPropertyName("data")]
    public PolisData? Data { get; set; }
}

public class PolisData
{
    [BsonElement("articles")]
    [JsonProperty("articles")]
    [JsonPropertyName("articles")]
    public List<Article>? Articles { get; set; }
}