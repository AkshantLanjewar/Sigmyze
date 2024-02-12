using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.Lunar 
{
    public class SimpleFolder
    {
        [BsonElement("folderName")]
        [JsonProperty("folderName")]
        [JsonPropertyName("folderName")]
        public string? FolderName { get; set; }

        [BsonElement("folderId")]
        [JsonProperty("folderId")]
        [JsonPropertyName("folderId")]
        public string? FolderId { get; set; }

        [BsonElement("folders")]
        [JsonProperty("folders")]
        [JsonPropertyName("folders")]
        public List<SimpleFolder>? Folders { get; set; }

        //these are the fileId's within this folder
        [BsonElement("files")]
        [JsonProperty("files")]
        [JsonPropertyName("files")]
        public List<string>? Files { get; set; }

        public bool Validate()
        {
            return true;
        }
    }

    public class SimpleFilesystem {
        [BsonElement("folders")]
        [JsonProperty("folders")]
        [JsonPropertyName("folders")]
        public List<SimpleFolder>? Folders { get; set; }

        // These are the fileId's within the root of the filesystem
        [BsonElement("files")]
        [JsonProperty("files")]
        [JsonPropertyName("files")]
        public List<string>? Files { get; set; }

        public bool ShallowValidate()
        {
            return true;
        }

        public bool Validate(string projectName, List<LunarChart> charts, List<LunarNote> notes)
        {
            return true;
        }
    }
}