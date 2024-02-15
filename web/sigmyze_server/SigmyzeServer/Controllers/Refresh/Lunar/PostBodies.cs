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

    public bool Validate()
    {
        if(LunarId == null || OrganizationId == null || ProjectId == null || Name == null)
            return false;

        return true;
    }
}

public class DeleteLunarProjectBody
{
    [JsonPropertyName("lunarId")]
    public string? LunarId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }
    
    [JsonPropertyName("projectId")]
    public string? ProjectId { get; set; }

    public bool Validate()
    {
        if(this.LunarId == null || this.OrganizationId == null || this.ProjectId == null)
            return false;

        return true;
    }
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

    public bool Validate()
    {
        if(this.LunarId == null || this.OrganizationId == null || this.ProjectId == null || this.NewFiletree == null)
            return false;
        if(this.NewFiletree.ShallowValidate() == false)
            return false;

        return true;
    }
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

    public bool Validate()
    {
        if(this.LunarId == null || this.OrganizationId == null || this.ProjectId == null || this.NewCharts == null)
            return false;

        //go through and validate the new charts
        for(int i = 0; i < this.NewCharts.Count; i++)
        {
            LunarChart chart = this.NewCharts[i];
            if(chart.Validate() == false)
                return false;
        }

        return true;
    }
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

    public bool Validate()
    {
        if(this.LunarId == null || this.OrganizationId == null || this.ProjectId == null || this.NewNotes == null)
            return false;

        //go through and validate the new notes
        for(int i = 0; i < this.NewNotes.Count; i++)
        {
            LunarNote note = this.NewNotes[i];
            if(note.Validate() == false)
                return false;
        }

        return true;
    }
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

    public bool Validate()
    {
        if(this.LunarId == null || this.OrganizationId == null || this.ProjectId == null || this.Name == null)
            return false;

        return true;
    }
}