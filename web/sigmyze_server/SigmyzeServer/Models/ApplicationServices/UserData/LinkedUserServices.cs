using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class UserServiceIndex
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        [JsonIgnore]
        public string? Id { get; set; }

        [BsonElement("user_id")]
        public string? UserId { get; set; }

        [BsonElement("linked_organizations")]
        public List<LinkedOrganization>? LinkedOrganizations { get; set; }

        public bool IsInOrganization(string organizationId)
        {
            if(this.UserId == null || this.LinkedOrganizations == null)
                return false;

            //go thru the organizations and check whether or not the id is a part of the organization
            for(int i = 0; i < this.LinkedOrganizations.Count; i++)
            {
                LinkedOrganization organization = this.LinkedOrganizations[i];
                if(organization.OrganizationName == null || organization.OrganizationId == null)
                    continue;

                if(organization.OrganizationId == organizationId)
                    return true;
            }

            return false;
        }
    }
}