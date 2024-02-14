using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SigmyzeServer.Models.Lunar;

namespace Test.Lunar;

public class LunarDocumentFilter
{
    [BsonElement("organizationId")]
    [JsonProperty("organizationId")]
    public string? OrganizationId { get; set; }

    [BsonElement("projectId")]
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