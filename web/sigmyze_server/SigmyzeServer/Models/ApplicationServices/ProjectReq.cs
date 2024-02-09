using System.Text.Json.Serialization;
using SigmyzeServer.Models.ApplicationServices;

public class UpdateProjectDataBody 
{
    [JsonPropertyName("data")]
    public ProjectData Data { get; set; }
}

public class UpdateQuantaDataBody
{
    [JsonPropertyName("data")]
    public QuantaProjectData? Data { get; set; }
}

public class AddQuantaIndicator
{
    [JsonPropertyName("processId")]
    public string? ProcessId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }

    [JsonPropertyName("quantaId")]
    public string? QuantaId { get; set; }

    [JsonPropertyName("indicators")]
    public List<string>? Indicators { get; set; }
}

public class UpdateQuantaIndicatorBody
{
    [JsonPropertyName("processId")]
    public string? ProcessId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }

    [JsonPropertyName("quantaId")]
    public string? QuantaId { get; set; }

    [JsonPropertyName("indicators")]
    public List<string>? Indicators { get; set; }

    [JsonPropertyName("mode")]
    public string? Mode { get; set; }

    public bool Validate() 
    { 
        if(this.ProcessId == null || this.OrganizationId == null || this.QuantaId == null)
            return false;
        if(this.Indicators == null || this.Mode == null)
            return false;

        return true;
    }
}