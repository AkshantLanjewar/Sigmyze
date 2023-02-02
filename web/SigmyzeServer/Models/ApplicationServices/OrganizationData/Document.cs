using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class Document
    {
        [BsonElement("document_id")]
        [JsonProperty("document_id")]
        [JsonPropertyName("document_id")]
        public string? DocumentId { get; set; }
        
        [BsonElement("data")]
        [JsonProperty("data")]
        [JsonPropertyName("data")]
        public IDocument? Data { get; set; }
    }

    public class IDocument
    {
        [BsonElement("pages")]
        [JsonProperty("pages")]
        [JsonPropertyName("pages")]
        public List<IDocumentPage>? Pages { get; set; }
        
        [BsonElement("data")]
        [JsonProperty("data")]
        [JsonPropertyName("data")]
        public IDocumentData? Data { get; set; }
    }

    public class IDocumentPage
    {
        [BsonElement("blocks")]
        [JsonProperty("blocks")]
        [JsonPropertyName("blocks")]
        public List<IDocumentBlock>? Blocks { get; set; }
    }

    public class IDocumentBlock
    {
        [BsonElement("id")]
        [JsonProperty("id")]
        [JsonPropertyName("id")]
        public string? Id { get; set; }
        
        [BsonElement("type")]
        [JsonProperty("type")]
        [JsonPropertyName("type")]
        public string? Type { get; set; }
        
        [BsonElement("order")]
        [JsonProperty("order")]
        [JsonPropertyName("order")]
        public int? Order { get; set; }

        [BsonElement("textNodes")]
        [JsonProperty("textNodes")]
        [JsonPropertyName("textNodes")]
        public List<TextNode>? TextNodes { get; set; }
        
        [BsonElement("imageData")]
        [JsonProperty("imageData")]
        [JsonPropertyName("imageData")]
        public string? ImageData { get; set; }
        
        [BsonElement("width")]
        [JsonProperty("width")]
        [JsonPropertyName("width")]
        public int? Width { get; set; }
        
        [BsonElement("height")]
        [JsonProperty("height")]
        [JsonPropertyName("height")]
        public int? Height { get; set; }
        
        [BsonElement("chartId")]
        [JsonProperty("chartId")]
        [JsonPropertyName("chartId")]
        public string? ChartId { get; set; }
        
        [BsonElement("chartData")]
        [JsonProperty("chartData")]
        [JsonPropertyName("chartData")]
        public ChartBlockData? ChartData { get; set; }
    }

    public class TextNode
    {
        [BsonElement("type")]
        [JsonProperty("type")]
        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [BsonElement("value")]
        [JsonProperty("value")]
        [JsonPropertyName("value")]
        public string? Value { get; set; }

        [BsonElement("id")]
        [JsonProperty("id")]
        [JsonPropertyName("id")]
        public string? Id { get; set; }
    }

    public class ChartBlockData
    {
        [BsonElement("title")]
        [JsonProperty("title")]
        [JsonPropertyName("title")]
        public string? Title { get; set; }
        
        [BsonElement("caption")]
        [JsonProperty("caption")]
        [JsonPropertyName("caption")]
        public string? Caption { get; set; }
        
        [BsonElement("presentationData")]
        [JsonProperty("presentationData")]
        [JsonPropertyName("presentationData")]
        public IPresentationChart? PresentationData { get; set; }
    }

    public class IPresentationChart
    {
        [BsonElement("node_id")]
        [JsonProperty("node_id")]
        [JsonPropertyName("node_id")]
        public string? NodeId { get; set; }
        
        [BsonElement("indicators")]
        [JsonProperty("indicators")]
        [JsonPropertyName("indicators")]
        public IIndicator? Indicators { get; set; }
        
        [BsonElement("chartSettings")]
        [JsonProperty("chartSettings")]
        [JsonPropertyName("chartSettings")]
        public IChartSettings? ChartSettings { get; set; }
        
        [BsonElement("chartGlobals")]
        [JsonProperty("chartGlobals")]
        [JsonPropertyName("chartGlobals")]
        public IGlobalChartSettings? ChartGlobals { get; set; }
    }

    public class IDocumentData
    {
        [BsonElement("image_store")]
        [JsonProperty("image_store")]
        [JsonPropertyName("image_store")]
        public Dictionary<string, string>? ImageStore { get; set; }
    }
}