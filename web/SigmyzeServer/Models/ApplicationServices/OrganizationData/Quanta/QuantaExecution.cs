using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.ApplicationServices;

public class UploadInternalStoreBody
{
    [BsonElement("preloadedData")]
    [JsonProperty("preloadedData")]
    [JsonPropertyName("preloadedData")]
    public string? PreloadedData { get; set; }
}

public class GetUploadStoreResponse
{
    [BsonElement("status")]
    [JsonProperty("status")]
    [JsonPropertyName("status")]
    public APIStatusMsg? Status { get; set; }

    [BsonElement("documents")]
    [JsonProperty("documents")]
    [JsonPropertyName("documents")]
    public List<QuantaInternalStoreWrapper>? Documents { get; set; }
}

public class UploadStoreSchema
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [Newtonsoft.Json.JsonIgnore]
    public string? Id { get; set; }

    [BsonElement("token")]
    [JsonProperty("token")]
    [JsonPropertyName("token")]
    public string? Token { get; set; }

    [BsonElement("chunk")]
    [JsonProperty("chunk")]
    [JsonPropertyName("chunk")]
    public string? Chunk { get; set; }
}

public class QuantaInternalStoreWrapper
{
    [BsonElement("value")]
    [JsonProperty("value")]
    [JsonPropertyName("value")]
    public string? Value { get; set; }

    [BsonElement("store")]
    [JsonProperty("store")]
    [JsonPropertyName("store")]
    public InternalStore? Store { get; set; }
}

public class InternalStore
{
    [BsonElement("nodeId")]
    [JsonProperty("nodeId")]
    [JsonPropertyName("nodeId")]
    public string? NodeId { get; set; }

    [BsonElement("socketId")]
    [JsonProperty("socketId")]
    [JsonPropertyName("socketId")]
    public string? SocketId { get; set; }
}