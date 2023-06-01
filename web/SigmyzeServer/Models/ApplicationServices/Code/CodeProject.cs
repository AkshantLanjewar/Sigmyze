using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices.Code;

public class CodeProject
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [Newtonsoft.Json.JsonIgnore]
    public string? Id { get; set; }

    [Newtonsoft.Json.JsonIgnore]
    [BsonElement("code_id")]
    public string? CodeId { get; set; }

    [BsonElement("filesystem")]
    [JsonProperty("filesystem")]
    [JsonPropertyName("filesystem")]
    public CodeFilesystem? Filesystem { get; set; }
}

public class CodeFilesystem
{
    [BsonElement("files")]
    [JsonProperty("files")]
    [JsonPropertyName("files")]
    public List<CodeFile>? Files { get; set; }

    [BsonElement("folders")]
    [JsonProperty("folders")]
    [JsonPropertyName("folders")]
    public List<CodeFolder>? Folders { get; set; }
}

public class CodeFile
{
    [BsonElement("file_name")]
    [JsonProperty("file_name")]
    [JsonPropertyName("file_name")]
    public string? FileName { get; set; }

    [BsonElement("file_type")]
    [JsonProperty("file_type")]
    [JsonPropertyName("file_type")]
    public string? FileType { get; set; }

    [BsonElement("file_content")]
    [JsonProperty("file_content")]
    [JsonPropertyName("file_content")]
    public string? FileContent { get; set; }

    [BsonElement("item_id")]
    [JsonProperty("item_id")]
    [JsonPropertyName("item_id")]
    public string? ItemId { get; set; }

    [BsonElement("hidden")]
    [Newtonsoft.Json.JsonIgnore]
    public bool? Hidden { get; set; } //if hidden, only sent to socket, not to client
}

public class CodeFolder
{
    [BsonElement("folder_name")]
    [JsonProperty("folder_name")]
    [JsonPropertyName("folder_name")]
    public string? FolderName { get; set; }

    [BsonElement("files")]
    [JsonProperty("files")]
    [JsonPropertyName("files")]
    public List<CodeFile>? Files { get; set; }

    [BsonElement("folders")]
    [JsonProperty("folders")]
    [JsonPropertyName("folders")]
    public List<CodeFolder>? Folders { get; set; }

    [BsonElement("item_id")]
    [JsonProperty("item_id")]
    [JsonPropertyName("item_id")]
    public string? ItemId { get; set; }
}