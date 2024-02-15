using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SigmyzeServer.Models.Lunar;

namespace Test.Lunar;

public class LunarDocumentFilter
{
    [JsonProperty("organizationId")]
    public string? OrganizationId { get; set; }

    [JsonProperty("projectId")]
    public string? ProjectId { get; set; }

    public bool Validate()
    {
        if(this.OrganizationId == null || this.ProjectId == null)
            return false;

        return true;
    }

    public bool Matches(LunarDocument document)
    {
        if(this.OrganizationId != null && document.OrganizationId != this.OrganizationId)
            return false;
        if(this.ProjectId != null && document.ProjectId != this.ProjectId)
            return false;

        return true;
    }
}

public class LunarDocumentSetFilters
{
    [JsonProperty("fileSystem")]
    public SimpleFilesystem? Filesystem { get; set; }

    [JsonProperty("notes")]
    public List<LunarNote>? Notes { get; set; }

    [JsonProperty("charts")]
    public List<LunarChart>? Charts { get; set; }

    [JsonProperty("projectName")]
    public string? ProjectName { get; set; }

    public LunarDocument Update(LunarDocument document)
    {
        LunarDocument newDocument = document;

        if(this.Filesystem != null)
            newDocument.Filesystem = this.Filesystem;
        if(this.Notes != null)
            newDocument.Notes = this.Notes;
        if(this.Charts != null)
            newDocument.Charts = this.Charts;
        if(this.ProjectName != null)
            newDocument.ProjectName = this.ProjectName;

        return newDocument;
    }
}

public class LunarDocumentUpdateFilter
{
    [JsonProperty("$set")]
    public LunarDocumentSetFilters? Set { get; set; }

    public LunarDocument Update(LunarDocument document)
    {
        LunarDocument newDocument = document;
        if(this.Set != null)
            newDocument = this.Set.Update(newDocument);

        return newDocument;
    }
}