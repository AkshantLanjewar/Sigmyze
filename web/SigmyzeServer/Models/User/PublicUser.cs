using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.User;

public class PublicUser
{
	[BsonElement("username")]
	[JsonProperty("username")]
	[JsonPropertyName(("username"))]
	public string? Username { get; set; }
	
	[BsonElement("lunar_ID")]
	[JsonProperty("lunar_ID")]
	[JsonPropertyName(("lunar_ID"))]
	public string? LunarId { get; set; }
}