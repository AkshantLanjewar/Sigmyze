using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices;

public class QuantaIndicatorRepositoryDef
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [Newtonsoft.Json.JsonIgnore]
    public string? Id { get; set; }

    [BsonElement("project_id")]
    [JsonProperty("project_id")]
    [JsonPropertyName("project_id")]
    public string? QuantaId { get; set; }

    [BsonElement("project_indicators")]
    [Newtonsoft.Json.JsonIgnore]
    public List<QuantaIndicator>? ProjectIndicators { get; set; }

    [BsonElement("indicator_chunks")]
    [Newtonsoft.Json.JsonIgnore]
    public List<string>? IndicatorChunks { get; set; }
}

public class QuantaIndicatorChunk
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [Newtonsoft.Json.JsonIgnore]
    public string? Id { get; set; }

    [BsonElement("project_id")]
    [JsonProperty("project_id")]
    [JsonPropertyName("project_id")]
    public string? QuantaId { get; set; }

    [BsonElement("chunk_id")]
    [JsonProperty("chunk_id")]
    [JsonPropertyName("chunk_id")]
    public string? ChunkId { get; set; }

    [BsonElement("chunk_indicators")]
    [Newtonsoft.Json.JsonIgnore]
    public List<QuantaIndicator>? ProjectIndicators { get; set; }
}

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

    [BsonElement("indicatorId")]
    [JsonProperty("indicatorId")]
    [JsonPropertyName("indicatorId")]
    public string? IndicatorId { get; set; }
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