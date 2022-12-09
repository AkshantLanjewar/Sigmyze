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

        [BsonElement("styles")]
        [JsonProperty("styles")]
        [JsonPropertyName("styles")]
        public BlockStyles? Styles { get; set; }
    }

    public class BlockStyles
    {
        [BsonElement("justify")]
        [JsonProperty("justify")]
        [JsonPropertyName("justify")]
        public string? Justify { get; set; }

        [BsonElement("size")]
        [JsonProperty("size")]
        [JsonPropertyName("size")]
        public BlockStylesSize? Size { get; set; }
    }

    public class BlockStylesSize
    {
        [BsonElement("width")]
        [JsonProperty("width")]
        [JsonPropertyName("width")]
        public float? Width { get; set; }

        [BsonElement("height")]
        [JsonProperty("height")]
        [JsonPropertyName("height")]
        public float? Height { get; set; }
    }

    public class DocumentIndicator
    {
        [BsonElement("id")]
        [JsonProperty("id")]
        [JsonPropertyName("id")]
        public string? Id { get; set; }

        [BsonElement("checked")]
        [JsonProperty("checked")]
        [JsonPropertyName("checked")]
        public bool Checked { get; set; }

        [BsonElement("category")]
        [JsonProperty("category")]
        [JsonPropertyName("category")]
        public string? Category { get; set; }

        [BsonElement("name")]
        [JsonProperty("name")]
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [BsonElement("indicator")]
        [JsonProperty("indicator")]
        [JsonPropertyName("indicator")]
        public ProjectIndicator? Indicator { get; set; }
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