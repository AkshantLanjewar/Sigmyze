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