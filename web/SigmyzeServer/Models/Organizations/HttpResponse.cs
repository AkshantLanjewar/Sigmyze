using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.Organizations;

public class RootResponse
{
	[JsonProperty("status")]
	public APIStatusMsg? Status { get; set; }
	
	[JsonProperty("organizations")]
	public List<Organization> Organizations { get; set; }
}