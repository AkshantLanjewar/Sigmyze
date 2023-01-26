using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class Node
    {
        [BsonElement("node_id")]
        public string? NodeId { get; set; }
        
        [BsonElement("node_name")]
        public string? NodeName { get; set; }

        [BsonElement("node_type")]
        public string? NodeType { get; set; }

        [BsonElement("children")]
        public List<Node>? Children { get; set; }
        
        [BsonElement("data")]
        public NodeData? Data { get; set; }
    }

    public class NodeData
    {   
        [BsonElement("document_id")]
        public string? DocumentId { get; set; }

        [BsonElement("indicators")]
        public List<IIndicator>? Indicators { get; set; }

        [BsonElement("chartSettings")]
        public IChartSettings? ChartSettings { get; set; }

        [BsonElement("chartGlobals")]
        public IGlobalChartSettings? ChartGlobals { get; set; }
    }
}