using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices;

public class QuantaIndicator
{
    [BsonElement("field")]
    [JsonProperty("field")]
    [JsonPropertyName("field")]
    public DatasetField? Field { get; set; }

    [BsonElement("chartData")]
    [JsonProperty("chartData")]
    [JsonPropertyName("chartData")]
    public List<ChartData>? ChartData { get; set; }
}

public class DatasetField
{
    [BsonElement("datasetFields")]
    [JsonProperty("datasetFields")]
    [JsonPropertyName("datasetFields")]
    public List<DatasetFieldItem>? DatasetFields { get; set; }
}

public class DatasetFieldItem
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
}

public class ChartData
{
    [BsonElement("xValue")]
    [JsonProperty("xValue")]
    [JsonPropertyName("xValue")]
    public int? XValue { get; set; }

    [BsonElement("yValue")]
    [JsonProperty("yValue")]
    [JsonPropertyName("yValue")]
    public float? YValue { get; set; }

    [BsonElement("isProjection")]
    [JsonProperty("isProjection")]
    [JsonPropertyName("isProjection")]
    public bool? IsProjection { get; set; }
}