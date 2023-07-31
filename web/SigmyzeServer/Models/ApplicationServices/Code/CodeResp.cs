using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.ApplicationServices.Code;

public class QuantaSuppositoryResp
{
    [JsonProperty("msg")]
    public APIStatusMsg? MSG { get; set; }

    [JsonProperty("items")]
    public List<SuppositoryItems>? Items { get; set; }
}

public class GetCodeProjectResp
{
    [JsonProperty("msg")]
    public APIStatusMsg? MSG { get; set; }

    [JsonProperty("filesystem")]
    public CodeFilesystem? Filesystem { get; set; }
}