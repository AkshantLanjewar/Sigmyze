using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace SigmyzeServer.Models.Data
{
    public class DatasetCollection
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("object_id")]
        public string ObjectID { get; set; }
        
        [BsonElement("object_fullname")]
        public string ObjectFullname { get; set; }

        [BsonElement("object_logo")]
        public string ObjectLogo { get; set; } 

        [BsonElement("indicators")]
        public List<DatasetIndicator> Indicators { get; set; }

        [BsonElement("added_countries")]
        public List<string>? AddedObjects { get; set; }

        [BsonElement("categories")]
        public List<string>? Categories { get; set; }

        [BsonElement("logo")]
        public string? Logo { get; set; }
    }

    public class DatasetIndicator
    {
        [BsonElement("indicator_id")]
        [JsonProperty("indicator_id")]
        [JsonPropertyName("indicator_id")]
        public string? IndicatorID { get; set; }

        [BsonElement("indicator_units")]
        [JsonProperty("indicator_units")]
        [JsonPropertyName("indicator_units")]
        public string? IndicatorUnits { get; set; }

        [BsonElement("indicator_name")]
        [JsonProperty("indicator_name")]
        [JsonPropertyName("indicator_name")]
        public string? IndicatorName { get; set; }

        [BsonElement("indicator_category")]
        [JsonProperty("indicator_category")]
        [JsonPropertyName("indicator_category")]
        public string? IndicatorCategory { get; set; }

        [BsonElement("indicator_data")]
        [JsonProperty("indicator_data")]
        [JsonPropertyName("indicator_data")]
        public List<DatasetData>? IndicatorData { get; set; }
    }

    public class DatasetData
    {
        [BsonElement("year")]
        [JsonProperty("year")]
        [JsonPropertyName("year")]
        public DateTime? Year { get; set; }

        [BsonElement("value")]
        [BsonRepresentation(BsonType.Double, AllowTruncation = true)]
        [JsonProperty("value")]
        [JsonPropertyName("value")]
        public float? Value { get; set; }

        [BsonElement("projection")]
        [JsonProperty("projection")]
        [JsonPropertyName("projection")]
        public bool? Projection { get; set; }
    }

    public class PublishedDatasetCollection
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("title")]
        [JsonProperty("title")]
        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [BsonElement("quantaId")]
        [JsonProperty("quantaId")]
        [JsonPropertyName("quantaId")]
        public string? QuantaId { get; set; }

        [BsonElement("description")]
        [JsonProperty("description")]
        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [BsonElement("public")]
        [JsonProperty("public")]
        [JsonPropertyName("public")]
        public bool? Public { get; set; }

        [BsonElement("public_id")]
        [JsonProperty("public_id")]
        [JsonPropertyName("public_id")]
        public string? PublicId { get; set; }

        public bool validateCard()
        {
            if(this.Title == null || this.PublicId == null || this.Description == null)
                return false;

            return true;
        }
    }

    public class OrganizationPublishedCollection
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("organization_id")]
        [JsonProperty("organization_id")]
        [JsonPropertyName("organization_id")]
        public string? OrganizationId { get; set; }

        [BsonElement("published_datasets")]
        [JsonProperty("published_datasets")]
        [JsonPropertyName("published_datasets")]
        public List<string>? PublishedDatasets { get; set; }

        public bool Verify()
        {
            if(this.PublishedDatasets == null || this.OrganizationId == null)
                return false;

            return true;
        }
    }
}