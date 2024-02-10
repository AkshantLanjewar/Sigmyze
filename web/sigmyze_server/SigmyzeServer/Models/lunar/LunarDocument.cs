namespace SigmyzeServer.Models.Lunar;
using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

public class LunarDocument
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [Newtonsoft.Json.JsonIgnore]
    [System.Text.Json.Serialization.JsonIgnore]
    public string? Id { get; set; }

    [BsonElement("organizationId")]
    [JsonProperty("organizationId")]
    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }

    [BsonElement("projectId")]
    [JsonProperty("projectId")]
    [JsonPropertyName("projectId")]
    public string? ProjectId { get; set; }
    
    [BsonElement("projectName")]
    [JsonProperty("projectName")]
    [JsonPropertyName("projectName")]
    public string? ProjectName { get; set; }

    [BsonElement("fileSystem")]
    [JsonProperty("fileSystem")]
    [JsonPropertyName("fileSystem")]
    public SimpleFilesystem? Filesystem { get; set; }

    [BsonElement("notes")]
    [JsonProperty("notes")]
    [JsonPropertyName("notes")]
    public List<LunarNote>? Notes { get; set; }

    [BsonElement("charts")]
    [JsonProperty("charts")]
    [JsonPropertyName("charts")]
    public List<LunarChart>? Charts { get; set; }

    public bool Validate()
    {
        return true;
    }
}