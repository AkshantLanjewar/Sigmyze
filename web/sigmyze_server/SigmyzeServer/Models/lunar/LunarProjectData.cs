using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.Lunar;

public class LunarProjectData
{
    [BsonElement("notes")]
    [JsonProperty("notes")]
    [JsonPropertyName("notes")]
    public List<LunarNote> Notes { get; set; }

    [BsonElement("charts")]
    [JsonProperty("charts")]
    [JsonPropertyName("chart")]
    public List<LunarChart> Charts { get; set; }

    [BsonElement("fileSystem")]
    [JsonProperty("fileSystem")]
    [JsonPropertyName("fileSystem")]
    public SimpleFilesystem? Filesystem { get; set; }

    public bool Validate()
    {
        if(this.Notes == null || this.Charts == null || this.Filesystem == null)
            return false;

        return true;
    }
}