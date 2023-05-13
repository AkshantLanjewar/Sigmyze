using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices;

public class QuantaQuery
{
    [BsonElement("fieldKey")]
    [JsonProperty("fieldKey")]
    [JsonPropertyName("fieldKey")]
    public string? FieldKey { get; set; }

    [BsonElement("fieldType")]
    [JsonProperty("fieldType")]
    [JsonPropertyName("fieldType")]
    public string? FieldType { get; set; }

    [BsonElement("stringField")]
    [JsonProperty("stringField")]
    [JsonPropertyName("stringField")]
    public string? StringField { get; set; }

    [BsonElement("dateField")]
    [JsonProperty("dateField")]
    [JsonPropertyName("dateField")]
    public int? DateField { get; set; }

    [BsonElement("multiValue")]
    [JsonProperty("multiValue")]
    [JsonPropertyName("multiValue")]
    public bool? MultiValue { get; set; }

    [BsonElement("stringFields")]
    [JsonProperty("stringFields")]
    [JsonPropertyName("stringFields")]
    public List<string>? StringFields { get; set; }

    [BsonElement("dateFields")]
    [JsonProperty("dateFields")]
    [JsonPropertyName("dateFields")]
    public List<int>? DateFields { get; set; }
}

public class QuantaQueryBody
{
    [BsonElement("params")]
    [JsonProperty("params")]
    [JsonPropertyName("params")]
    public List<QuantaQuery>? Params { get; set; }

    [BsonElement("quantaId")]
    [JsonProperty("quantaId")]
    [JsonPropertyName("quantaId")]
    public string? QuantaId { get; set; }
}