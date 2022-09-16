using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.UserData
{
    public class Document
    {
        [BsonElement("document_id")]
        [JsonProperty("document_id")]
        public string? DocumentID { get; set; }

        [BsonElement("data_location")]
        [JsonProperty("data_location")]
        public string? DataLocation { get; set; }

        [BsonElement("document_name")]
        [JsonProperty("document_name")]
        public string? DocumentName { get; set; }

        [BsonElement("document_content")]
        [JsonProperty("document_content")]
        public List<DocumentBlock>? DocumentBlocks { get; set; }
    }

    public class DocumentBlock
    {
        [BsonElement("id")]
        [JsonProperty("id")]
        public string? ID { get; set; }

        [BsonElement("html")]
        [JsonProperty("html")]
        public string? HTML { get; set; }

        [BsonElement("tag")]
        [JsonProperty("tag")]
        public string? Tag { get; set; }

        [BsonElement("data")]
        [JsonProperty("data")]
        public DocumentData? Data { get; set; }
    }

    public class DocumentIndicator
    {
        [BsonElement("indicator_id")]
        [JsonProperty("indicator_id")]
        public string? IndicatorID { get; set; }

        [BsonElement("object_id")]
        [JsonProperty("object_id")]
        public string? ObjectID { get; set; }

        [BsonElement("dataset")]
        [JsonProperty("dataset")]
        public string? Dataset { get; set; }
    }

    public class DocumentData
    {
        [BsonElement("text")]
        [JsonProperty("text")]
        public string? Text { get; set; }

        [BsonElement("image_data")]
        [JsonProperty("image_data")]
        public string? ImageData { get; set; }

        [BsonElement("update_image")]
        [JsonProperty("update_image")]
        public bool UpdateImage { get; set; }

        [BsonElement("title")]
        [JsonProperty("title")]
        public string? Title { get; set; }

        [BsonElement("description")]
        [JsonProperty("description")]
        public string? Description { get; set; }

        [BsonElement("indicators")]
        [JsonProperty("indicators")]
        public List<DocumentIndicator>? Indicators { get; set; }
    }
}