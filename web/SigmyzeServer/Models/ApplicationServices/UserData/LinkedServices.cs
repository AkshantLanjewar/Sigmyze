using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class LinkedOrganization
    {
        [BsonElement("organization_id")]
        public string? OrganizationId { get; set; }
        
        [BsonElement("organization_name")]
        public string? OrganizationName { get; set; }
    }
}