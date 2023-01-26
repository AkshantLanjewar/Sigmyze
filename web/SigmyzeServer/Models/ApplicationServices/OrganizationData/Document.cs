using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class Document
    {
        [BsonElement("document_id")]
        public string? DocumentId { get; set; }
        
        [BsonElement("data")]
        public IDocument? Data { get; set; }
    }

    public class IDocument
    {
        [BsonElement("pages")]
        public List<IDocumentPage>? Pages { get; set; }
        
        [BsonElement("data")]
        public IDocumentData? Data { get; set; }
    }

    public class IDocumentPage
    {
        [BsonElement("blocks")]
        public List<IDocumentBlock>? Blocks { get; set; }
    }

    public class IDocumentBlock
    {
        [BsonElement("id")]
        public string? Id { get; set; }
        
        [BsonElement("type")]
        public string? Type { get; set; }
        
        [BsonElement("order")]
        public int? Order { get; set; }
        
        [BsonElement("imageData")]
        public string? ImageData { get; set; }
        
        [BsonElement("width")]
        public int? Width { get; set; }
        
        [BsonElement("height")]
        public int? Height { get; set; }
        
        [BsonElement("chartId")]
        public string? ChartId { get; set; }
        
        [BsonElement("chartData")]
        public ChartBlockData? ChartData { get; set; }
    }

    public class ChartBlockData
    {
        [BsonElement("title")]
        public string? Title { get; set; }
        
        [BsonElement("caption")]
        public string? Caption { get; set; }
        
        [BsonElement("presentationData")]
        public IPresentationChart? PresentationData { get; set; }
    }

    public class IPresentationChart
    {
        [BsonElement("node_id")]
        public string? NodeId { get; set; }
        
        [BsonElement("indicators")]
        public IIndicator? Indicators { get; set; }
        
        [BsonElement("chartSettings")]
        public IChartSettings? ChartSettings { get; set; }
        
        [BsonElement("chartGlobals")]
        public IGlobalChartSettings? ChartGlobals { get; set; }
    }

    public class IDocumentData
    {
        [BsonElement("image_store")]
        public Dictionary<string, string>? ImageStore { get; set; }
    }
}