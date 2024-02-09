using Newtonsoft.Json;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.ApplicationServices;

public class GetProjectResp
{
    [JsonProperty("status")]
    public APIStatusMsg? Status { get; set; }

    [JsonProperty("project_data")]
    public ProjectData? ProjectData { get; set; }
}

public class GetQuantaProjectResp
{
    [JsonProperty("status")]
    public APIStatusMsg? Status { get; set; }

    [JsonProperty("project_data")]
    public QuantaRepositoryDefinition? ProjectData { get; set; }
}

public class GetQuantaIndicatorsResp
{
    [JsonProperty("status")]
    public APIStatusMsg? Status { get; set; }
    
    [JsonProperty("indicators")]
    public List<QuantaIndicator>? Indicators { get; set; }
}

public class GetQuantaIndicatorResp
{
    [JsonProperty("status")]
    public APIStatusMsg? Status { get; set; }
    
    [JsonProperty("indicator")]
    public QuantaIndicator? Indicator { get; set; }
}

public class GetQuantaIndicatorsLengthResp
{
    [JsonProperty("status")]
    public APIStatusMsg? Status { get; set; }

    [JsonProperty("length")]
    public int? Length { get; set; }
}