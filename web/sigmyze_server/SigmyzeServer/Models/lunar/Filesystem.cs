using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.Lunar 
{
    public class SimpleFolder
    {
        [JsonProperty("folderName")]
        [JsonPropertyName("folderName")]
        public string? FolderName { get; set; }

        [JsonProperty("folderId")]
        [JsonPropertyName("folderId")]
        public string? FolderId { get; set; }

        [JsonProperty("folders")]
        [JsonPropertyName("folders")]
        public List<SimpleFolder>? Folders { get; set; }

        //these are the fileId's within this folder
        [JsonProperty("files")]
        [JsonPropertyName("files")]
        public List<string>? Files { get; set; }

        public bool Validate()
        {
            return true;
        }
    }

    public class SimpleFilesystem {
        [JsonProperty("folders")]
        [JsonPropertyName("folders")]
        public List<SimpleFolder>? Folders { get; set; }

        // These are the fileId's within the root of the filesystem
        [JsonProperty("files")]
        [JsonPropertyName("files")]
        public List<string>? Files { get; set; }

        public bool Validate(string projectName, List<LunarChart> charts, List<LunarNote> notes)
        {
            return true;
        }
    }
}