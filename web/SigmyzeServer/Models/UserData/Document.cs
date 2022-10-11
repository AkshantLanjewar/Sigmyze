using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace SigmyzeServer.Models.UserData
{
    public class Document
    {
        [BsonElement("document_id")]
        [JsonProperty("document_id")]
        [JsonPropertyName("document_id")]
        public string? DocumentID { get; set; }

        [BsonElement("data_location")]
        [JsonProperty("data_location")]
        [JsonPropertyName("data_location")]
        public string? DataLocation { get; set; }

        [BsonElement("document_name")]
        [JsonProperty("document_name")]
        [JsonPropertyName("document_name")]
        public string? DocumentName { get; set; }

        [BsonElement("document_content")]
        [JsonProperty("document_content")]
        [JsonPropertyName("document_content")]
        public List<DocumentBlock>? DocumentBlocks { get; set; }
    }

    public class DocumentBlock
    {
        [BsonElement("id")]
        [JsonProperty("id")]
        [JsonPropertyName("id")]
        public string? ID { get; set; }

        [BsonElement("html")]
        [JsonProperty("html")]
        [JsonPropertyName("html")]
        public string? HTML { get; set; }

        [BsonElement("tag")]
        [JsonProperty("tag")]
        [JsonPropertyName("tag")]
        public string? Tag { get; set; }

        [BsonElement("data")]
        [JsonProperty("data")]
        [JsonPropertyName("data")]
        public DocumentData? Data { get; set; }
    }

    public class DocumentIndicator
    {
        [BsonElement("indicator_id")]
        [JsonProperty("indicator_id")]
        [JsonPropertyName("indicator_id")]
        public string? IndicatorID { get; set; }

        [BsonElement("object_id")]
        [JsonProperty("object_id")]
        [JsonPropertyName("object_id")]
        public string? ObjectID { get; set; }

        [BsonElement("dataset")]
        [JsonProperty("dataset")]
        [JsonPropertyName("dataset")]
        public string? Dataset { get; set; }
    }

    public class DocumentData
    {
        [BsonElement("text")]
        [JsonProperty("text")]
        [JsonPropertyName("text")]
        public string? Text { get; set; }

        [BsonElement("image_data")]
        [JsonProperty("image_data")]
        [JsonPropertyName("image_data")]
        public string? ImageData { get; set; }

        [BsonElement("update_image")]
        [JsonProperty("update_image")]
        [JsonPropertyName("update_image")]
        public bool UpdateImage { get; set; }

        [BsonElement("title")]
        [JsonProperty("title")]
        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [BsonElement("description")]
        [JsonProperty("description")]
        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [BsonElement("indicators")]
        [JsonProperty("indicators")]
        [JsonPropertyName("indicators")]
        public List<DocumentIndicator>? Indicators { get; set; }
    }
}