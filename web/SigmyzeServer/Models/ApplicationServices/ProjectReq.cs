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