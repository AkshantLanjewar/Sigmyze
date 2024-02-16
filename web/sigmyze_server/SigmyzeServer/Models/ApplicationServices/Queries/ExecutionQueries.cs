using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.ApplicationServices.UserData;

public class GetUploadChunkData
{
    [BsonElement("_id")]
    [Newtonsoft.Json.JsonIgnore]
    public int? Id { get; set; }

    [BsonElement("chunk")]
    public string? Chunk { get; set; }
}