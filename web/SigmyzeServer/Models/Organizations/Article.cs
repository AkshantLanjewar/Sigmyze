using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.UserData;

namespace SigmyzeServer.Models.Organizations;

public class Article
{
	[BsonElement("published_id")]
	[JsonProperty("published_id")]
	[JsonPropertyName(("published_id"))]
	public string? PublishedId { get; set; }
	
	[BsonElement("published_title")]
	[JsonProperty("published_title")]
	[JsonPropertyName(("published_title"))]
	public string? PublishedTitle { get; set; }

	[BsonElement("published_subtitle")]
	[JsonProperty("published_subtitle")]
	[JsonPropertyName("published_subtitle")]
	public string? PublishedSubtitle { get; set; }
	
	[BsonElement("published_date")]
	[JsonProperty("published_date")]
	[JsonPropertyName(("published_date"))]
	public DateTime? PublishedDate { get; set; }
	
	[BsonElement("public_user")]
	[JsonProperty("public_user")]
	[JsonPropertyName(("public_user"))]
	public PublicUser? PublicUser { get; set; }
	
	[BsonElement("content")]
	[JsonProperty("content")]
	[JsonPropertyName(("content"))]
	public Document? Content { get; set; }
}