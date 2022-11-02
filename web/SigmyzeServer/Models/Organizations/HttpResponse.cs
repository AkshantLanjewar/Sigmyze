using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.UserData;

namespace SigmyzeServer.Models.Organizations;

public class RootResponse
{
	[JsonProperty("status")]
	public APIStatusMsg? Status { get; set; }
	
	[JsonProperty("organizations")]
	public List<Organization> Organizations { get; set; }
}

public class OrganizationResponse
{
	[JsonProperty("status")]
	public APIStatusMsg? Status { get; set; }
	
	[JsonProperty("organization")]
	public Organization? Organization { get; set; }
	
	[JsonProperty("drive")]
	public Drive? Drive { get; set; }
}