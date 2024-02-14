using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

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
}