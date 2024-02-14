using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SigmyzeServer.Models.ApplicationServices;

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

        public List<string> GetAllFileIds()
        {
            if(this.Files == null || this.Folders == null)
                return new List<string>();

            List<string> fileIds = new List<string>();
            for(int i = 0; i < Files.Count; i++)
            {
                string file = Files[i];
                fileIds.Add(file);
            }

            //recurse through the folder and call again
            for(int i = 0; i < this.Folders.Count; i++)
            {
                SimpleFolder folder = this.Folders[i];
                List<string> subFileIds = folder.GetAllFileIds();
                fileIds.Concat(subFileIds);
            }

            return fileIds;
        }

        private bool NullCheck()
        {
            if(this.FolderName == null || this.FolderId == null || this.Folders == null || this.Files == null)
                return false;

            return true;
        }

        public bool Validate()
        {
            if(NullCheck() == false)
                return false;
            for(int i = 0; i < this.Folders!.Count; i++)
            {
                SimpleFolder folder = this.Folders[i];
                if(folder.Validate() == false)
                    return false;
            }

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

        public List<string> GetAllFileIds()
        {
            if(this.Files == null || this.Folders == null)
                return new List<string>();

            List<string> fileIds = new List<string>();
            fileIds = fileIds.Concat(this.Files).ToList();

            //get all the folder fileIds's now
            for(int i = 0; i < this.Folders.Count; i++)
            {
                List<string> subFileIds = this.Folders[i].GetAllFileIds();
                fileIds = fileIds.Concat(subFileIds).ToList();
            }

            return fileIds;
        }

        public bool ShallowValidate()
        {
            if(NullCheck() == false)
                return false;

            //go through the subfolders and validate them
            for(int i = 0; i < this.Folders!.Count; i++)
            {
                SimpleFolder folder = this.Folders[i];
                if(folder.Validate() == false)
                    return false;
            }

            return true;
        }

        private bool NullCheck()
        {
            if(this.Folders == null || this.Files == null)
                return false;

            return true;
        }

        public bool Validate(string projectName, List<LunarChart> charts, List<LunarNote> notes)
        {
            List<string> fileIds = GetAllFileIds();
            if(NullCheck() == false)
                return false;
            if(this.Files!.Count > 0)
                return false;
            if(this.Folders!.Count == 0)
                return false;

            //go thru and validate all the subfolders
            for(int i = 0; i < this.Folders!.Count; i++)
            {
                SimpleFolder folder = this.Folders[i];
                if(folder.Validate() == false)
                    return false;
            }

            if(this.Folders[0].FolderName != projectName)
                return false;
            

            //go through the charts and remove the fileId of each chart from the fileIds
            for(int i = 0; i < charts.Count; i++)
            {
                LunarChart chart = charts[i];
                if(chart.Validate() == false)
                    return false;

                int fileIdIndex = fileIds.IndexOf(chart.ObjectId!);
                if(fileIdIndex == -1)
                    return false;

                fileIds.RemoveAt(fileIdIndex);
            }

            //go through the notes and remove the fileId of each note from the fileIds
            for(int i = 0; i < notes.Count; i++)
            {
                LunarNote note = notes[i];
                if(note.Validate() == false)
                    return false;

                int fileIdIndex = fileIds.IndexOf(note.ObjectId!);
                if(fileIdIndex == -1)
                    return false;

                fileIds.RemoveAt(fileIdIndex);
            }

            if(fileIds.Count > 0)
                return false;

            return true;
        }
    }
}