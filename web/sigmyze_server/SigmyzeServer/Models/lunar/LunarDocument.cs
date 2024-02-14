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

    public bool ValidateFilesystemName()
    {
        if(this.ProjectName == null || this.Filesystem == null)
            return false;
        if(this.Notes == null || this.Charts == null)
            return false;

        // go through and validate all the notes in the project
        for(int i = 0; i < this.Notes.Count; i++)
            if(this.Notes[i].Validate() == false)
                return false;
        
        //go through and validate all the charts in the project
        for(int i = 0; i < this.Charts.Count; i++)
            if(this.Charts[i].Validate() == false)
                return false;

        if(this.Filesystem.Validate(this.ProjectName, this.Charts, this.Notes) == false)
            return false;
        if(this.Filesystem.Folders![0].FolderName != this.ProjectName)
            return false;

        return true;
    }

    public bool NullCheck()
    {
        if(this.OrganizationId == null || this.ProjectId == null || this.ProjectName == null)
            return false;
        if(this.Charts == null || this.Filesystem == null || this.Charts == null)
            return false;

        return true;
    }

    public bool Validate()
    {
        if(NullCheck() == false)
            return false;
        if(ValidateFilesystemName() == false)
            return false;

        return true;
    }
}