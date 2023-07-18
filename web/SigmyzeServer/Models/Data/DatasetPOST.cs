using System.Text.Json.Serialization;

namespace SigmyzeServer.Models.Data;

public class PublishDatasetPOST
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("datasetId")]
    public string? DatasetId { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("public")]
    public bool? Public { get; set; }

    [JsonPropertyName("quantaId")]
    public string? QuantaId { get; set; }

    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }

    public bool Verify()
    {
        if(this.Title == null || this.DatasetId == null || this.Description == null)
            return false;
        if(this.Public == null || this.QuantaId == null || this.OrganizationId == null)
            return false;
        
        return true;
    }
}

public class UnpublishDatasetPOST
{
    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }

    [JsonPropertyName("quantaId")]
    public string? QuantaId { get; set; }

    public bool Verify()
    {
        if(this.OrganizationId == null || this.QuantaId == null)
            return false;

        return true;
    }
}