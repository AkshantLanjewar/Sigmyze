namespace SigmyzeServer.Models.Lunar;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

public class QuantaIndicatorLocation
{
    [JsonProperty("datasetId")]
    [JsonPropertyName("datasetId")]
    public string? DatasetId { get; set; }

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
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonProperty("objectId")]
    [JsonPropertyName("objectId")]
    public string? ObjectId { get; set; }

    [JsonProperty("indicators")]
    [JsonPropertyName("indicators")]
    public List<QuantaIndicatorLocation>? Indicators { get; set; }

    public bool Validate()
    {
        return true;
    }
}