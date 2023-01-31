using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class Node
    {
        [BsonElement("node_id")]
        [JsonProperty("node_id")]
        [JsonPropertyName("node_id")]
        public string? NodeId { get; set; }
        
        [BsonElement("node_name")]
        [JsonProperty("node_name")]
        [JsonPropertyName("node_name")]
        public string? NodeName { get; set; }

        [BsonElement("node_type")]
        [JsonProperty("node_type")]
        [JsonPropertyName("node_type")]
        public string? NodeType { get; set; }

        [BsonElement("children")]
        [JsonProperty("children")]
        [JsonPropertyName("children")]
        public List<Node>? Children { get; set; }
        
        [BsonElement("data")]
        [JsonProperty("data")]
        [JsonPropertyName("data")]
        public NodeData? Data { get; set; }
    }

    public class NodeData
    {   
        [BsonElement("document_id")]
        [JsonProperty("document_id")]
        [JsonPropertyName("document_id")]
        public string? DocumentId { get; set; }

        [BsonElement("indicators")]
        [JsonProperty("indicators")]
        [JsonPropertyName("indicators")]
        public List<IIndicator>? Indicators { get; set; }

        [BsonElement("chartSettings")]
        [JsonProperty("chartSettings")]
        [JsonPropertyName("chartSettings")]
        public IChartSettings? ChartSettings { get; set; }

        [BsonElement("chartGlobals")]
        [JsonProperty("chartGlobals")]
        [JsonPropertyName("chartGlobals")]
        public IGlobalChartSettings? ChartGlobals { get; set; }
    }
}