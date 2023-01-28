using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.ApplicationServices;

public class OrganizationRootResp
{
    [JsonProperty("msg")]
    public APIStatusMsg? msg { get; set; }
    
    [JsonProperty("organizations")]
    public List<LinkedOrganization>? Organizations { get; set; }
}