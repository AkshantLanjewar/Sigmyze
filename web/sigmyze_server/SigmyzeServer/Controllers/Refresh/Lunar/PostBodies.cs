using System.Text.Json.Serialization;
using SigmyzeServer.Models.Lunar;

namespace SigmyzeServer.Controllers.Lunar;

public class CreateLunarProjectBody
{
    [JsonPropertyName("lunarId")]
    public string? LunarId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }

    [JsonPropertyName("projectId")]
    public string? ProjectId { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }
}

public class DeleteLunarProjectBody
{
    [JsonPropertyName("lunarId")]
    public string? LunarId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }
    
    [JsonPropertyName("projectId")]
    public string? ProjectId { get; set; }
}

public class UpdateLunarFileTreeBody
{
    [JsonPropertyName("lunarId")]
    public string? LunarId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }
    
    [JsonPropertyName("projectId")]
    public string? ProjectId { get; set; }

    [JsonPropertyName("newFiletree")]
    public SimpleFilesystem? NewFiletree { get; set; }
}

public class UpdateLunarChartsBody
{
    [JsonPropertyName("lunarId")]
    public string? LunarId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }
    
    [JsonPropertyName("projectId")]
    public string? ProjectId { get; set; }

    [JsonPropertyName("newCharts")]
    public List<LunarChart>? NewCharts { get; set; }
}

public class UpdateLunarNotesBody
{
    [JsonPropertyName("lunarId")]
    public string? LunarId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }
    
    [JsonPropertyName("projectId")]
    public string? ProjectId { get; set; }

    [JsonPropertyName("newNotes")]
    public List<LunarNote>? NewNotes { get; set; }
}

public class UpdateLunarNameBody
{
    [JsonPropertyName("lunarId")]
    public string? LunarId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }
    
    [JsonPropertyName("projectId")]
    public string? ProjectId { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }
}