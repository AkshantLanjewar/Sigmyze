using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class LinkedOrganization
    {
        [BsonElement("organization_id")]
        [JsonProperty("organization_id")]
        public string? OrganizationId { get; set; }
        
        [BsonElement("organization_name")]
        [JsonProperty("organization_name")]
        public string? OrganizationName { get; set; }
    }
}