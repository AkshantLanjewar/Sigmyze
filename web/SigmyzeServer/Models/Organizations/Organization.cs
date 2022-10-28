using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SigmyzeServer.Models.UserData;

namespace SigmyzeServer.Models.Organizations;

public class Organization
{
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
	public string? OrganizationAdmin { get; set; }
	
	[BsonElement("user_organization")]
	[JsonProperty("user_organization")]
	[JsonPropertyName(("user_organization"))]
	public bool UserOrganization { get; set; }
	
	[BsonElement("organization_drive")]
	[JsonProperty("organization_drive")]
	[JsonPropertyName(("organization_drive"))]
	public string? OrganizationDrive { get; set; }
	
	[BsonElement("organization_users")]
	[JsonProperty("organization_users")]
	[JsonPropertyName(("organization_users"))]
	public List<string>? OrganizationUsers { get; set; }
	
	[BsonElement("organization_publishers")]
	[JsonProperty("organization_publishers")]
	[JsonPropertyName(("organization_publishers"))]
	public List<string>? OrganizationPublishers { get; set; }
	
	[BsonElement("article_queue")]
	[JsonProperty("article_queue")]
	[JsonPropertyName(("article_queue"))]
	public List<Article>? ArticleQueue { get; set; }
	
	[BsonElement("articles")]
	[JsonProperty("articles")]
	[JsonPropertyName(("articles"))]
	public List<Article>? Articles { get; set; }
}