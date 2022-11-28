using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.Polis;

public class Layout
{
    [BsonElement("layout_id")]
    [JsonProperty("layout_id")]
    [JsonPropertyName("layout_id")]
    public string? LayoutId { get; set; }

    [BsonElement("panes")]
    [JsonProperty("panes")]
    [JsonPropertyName("panes")]
    public List<LayoutPane>? Panes { get; set; }
}

public class LayoutPane
{
    [BsonElement("pane_id")]
    [JsonProperty("pane_id")]
    [JsonPropertyName("pane_id")]
    public string? PaneId { get; set; }

    [BsonElement("title")]
    [JsonProperty("title")]
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [BsonElement("subtitle")]
    [JsonProperty("subtitle")]
    [JsonPropertyName("subtitle")]
    public string? Subtitle { get; set; }
}