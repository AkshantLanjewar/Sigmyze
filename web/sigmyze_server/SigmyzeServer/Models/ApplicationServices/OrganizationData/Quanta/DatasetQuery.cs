using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices;

public class DatasetQueryBody
{
    [BsonElement("params")]
    [JsonProperty("params")]
    [JsonPropertyName("params")]
    public List<QuantaQuery>? Params { get; set; }

    [BsonElement("token")]
    [JsonProperty("token")]
    [JsonPropertyName("token")]
    public string? Token { get; set; }
}