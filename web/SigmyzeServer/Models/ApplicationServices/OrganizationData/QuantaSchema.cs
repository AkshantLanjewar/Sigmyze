using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices;

public class QuantaSchema
{
    [BsonElement("name")]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [BsonElement("type")]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [BsonElement("nodeId")]
    [JsonProperty("nodeId")]
    [JsonPropertyName("nodeId")]
    public string? NodeId { get; set; }

    [BsonElement("hasChildren")]
    [JsonProperty("hasChildren")]
    [JsonPropertyName("hasChildren")]
    public bool? HasChildren { get; set; }

    [BsonElement("children")]
    [JsonProperty("children")]
    [JsonPropertyName("children")]
    public List<QuantaSchema>? Children { get; set; }

    [BsonElement("quantaType")]
    [JsonProperty("quantaType")]
    [JsonPropertyName("quantaType")]
    public QuantaType? QuantaType { get; set; }
}

public class QuantaType
{
    [BsonElement("groupId")]
    [JsonProperty("groupId")]
    [JsonPropertyName("groupId")]
    public string? GroupId { get; set; }

    [BsonElement("typeId")]
    [JsonProperty("typeId")]
    [JsonPropertyName("typeId")]
    public string? TypeId { get; set; }
}