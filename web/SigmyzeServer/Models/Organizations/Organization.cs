using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SigmyzeServer.Models.UserData;

namespace SigmyzeServer.Models.Organizations;

public class Organization
{
	[BsonId]
	[BsonRepresentation(BsonType.ObjectId)]
	[System.Text.Json.Serialization.JsonIgnore]
	[Newtonsoft.Json.JsonIgnore]
	public string? Id { get; set; }
	
	[BsonElement("organization_id")]
	[JsonProperty("organization_id")]
	[JsonPropertyName(("organization_id"))]
	public string? OrganizationId { get; set; }
	
	[BsonElement("organization_name")]
	[JsonProperty("organization_name")]
	[JsonPropertyName(("organization_name"))]
	public string? OrganizationName { get; set; }
	
	[BsonElement("organization_admin")]
	[JsonProperty("organization_admin")]
	[JsonPropertyName(("organization_admin"))]
	[Newtonsoft.Json.JsonIgnore]
	public string? OrganizationAdmin { get; set; }
	
	[BsonElement("user_organization")]
	[JsonProperty("user_organization")]
	[JsonPropertyName(("user_organization"))]
	public bool UserOrganization { get; set; }
	
	[BsonElement("organization_drive")]
	[JsonProperty("organization_drive")]
	[JsonPropertyName(("organization_drive"))]
	[Newtonsoft.Json.JsonIgnore]
	public string? OrganizationDrive { get; set; }
	
	[BsonElement("organization_users")]
	[JsonProperty("organization_users")]
	[JsonPropertyName(("organization_users"))]
	[Newtonsoft.Json.JsonIgnore]
	public List<string>? OrganizationUsers { get; set; }
	
	[BsonElement("organization_publishers")]
	[JsonProperty("organization_publishers")]
	[JsonPropertyName(("organization_publishers"))]
	[Newtonsoft.Json.JsonIgnore]
	public List<string>? OrganizationPublishers { get; set; }

	[BsonElement("has_page")]
	[JsonProperty("has_page")]
	[JsonPropertyName("has_page")]
	public bool HasPage { get; set; }

	[BsonElement("published_queue")]
	[JsonProperty("published_queue")]
	[JsonPropertyName("published_queue")]
	public List<Article>? PublishedQueue { get; set; }

	[BsonElement("published")]
	[JsonProperty("published")]
	[JsonPropertyName("published")]
	public List<Article>? Published { get; set; }

	[BsonElement("polis_id")]
	[JsonProperty("polis_id")]
	[JsonPropertyName("polis_id")]
	public string? PolisId { get; set; }
}