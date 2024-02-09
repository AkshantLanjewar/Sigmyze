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

public class DeleteFolderBody
{
    [JsonPropertyName("parent_folder")]
    public string? ParentFolder { get; set; }

    [JsonPropertyName("folder_id")]
    public string? FolderId { get; set; }

    [JsonPropertyName("organization_id")]
    public string? OrganizationId { get; set; }
}

public class UpdateFolderBody
{
    [JsonPropertyName("parent_folder")]
    public string? ParentFolder { get; set; }

    [JsonPropertyName("folder_id")]
    public string? FolderId { get; set; }

    [JsonPropertyName("organization_id")]
    public string? OrganizationId { get; set; }

    [JsonPropertyName("folder_name")]
    public string? FolderName { get; set; }
}

public class CreateProjectBody
{
    [JsonPropertyName("parent_folder")]
    public string? ParentFolder { get; set; }

    [JsonPropertyName("organization_id")]
    public string? OrganizationId { get; set; }

    [JsonPropertyName("project_name")]
    public string? ProjectName { get; set; }

    [JsonPropertyName("project_type")]
    public string? ProjectType { get; set; }
}

public class DeleteProjectBody
{
    [JsonPropertyName("parent_folder")]
    public string? ParentFolder { get; set; }

    [JsonPropertyName("organization_id")]
    public string? OrganizationId { get; set; }

    [JsonPropertyName("project_id")]
    public string? ProjectId { get; set; }

    [JsonPropertyName("project_type")]
    public string? ProjectType { get; set; }
}

public class UpdateProjectBody
{
    [JsonPropertyName("parent_folder")]
    public string? ParentFolder { get; set; }

    [JsonPropertyName("organization_id")]
    public string? OrganizationId { get; set; }

    [JsonPropertyName("project_id")]
    public string? ProjectId { get; set; }

    [JsonPropertyName("project_name")]
    public string? ProjectName { get; set; }

    [JsonPropertyName("project_type")]
    public string? ProjectType { get; set; }
}