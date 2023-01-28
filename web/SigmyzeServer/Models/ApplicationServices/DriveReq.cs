using System.Text.Json.Serialization;

namespace SigmyzeServer.Models.ApplicationServices;

public class CreateFolderBody
{   
    [JsonPropertyName("parent_folder")]
    public string? ParentFolder { get; set; }

    [JsonPropertyName("folder_name")]
    public string? FolderName { get; set; }

    [JsonPropertyName("organization_id")]
    public string? OrganizationId { get; set; }
}

public class CreateProjectBody
{
    [JsonPropertyName("parent_folder")]
    public string? ParentFolder { get; set; }

    [JsonPropertyName("organization_id")]
    public string? OrganizationId { get; set; }

    [JsonPropertyName("project_name")]
    public string? ProjectName { get; set; }
}