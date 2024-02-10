namespace SigmyzeServer.Models.Lunar;

using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

public class QuantaIndicatorLocation
{
    [BsonElement("datasetId")]
    [JsonProperty("datasetId")]
    [JsonPropertyName("datasetId")]
    public string? DatasetId { get; set; }

    [BsonElement("indicatorId")]
    [JsonProperty("indicatorId")]
    [JsonPropertyName("indicatorId")]
    public string? IndicatorId { get; set; }

    public bool Validate()
    {
        return true;
    }
}

public class LunarChart
{
    [BsonElement("name")]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [BsonElement("objectId")]
    [JsonProperty("objectId")]
    [JsonPropertyName("objectId")]
    public string? ObjectId { get; set; }

    [BsonElement("indicators")]
    [JsonProperty("indicators")]
    [JsonPropertyName("indicators")]
    public List<QuantaIndicatorLocation>? Indicators { get; set; }

    public bool Validate()
    {
        return true;
    }
}