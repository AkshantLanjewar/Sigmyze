using Newtonsoft.Json;

namespace SigmyzeServer.Models.API;

public class QuantaDatasetDisplay 
{
    [JsonProperty("datasetName")]
    public string? DatasetName { get; set; }

    [JsonProperty("datasetId")]
    public string? DatasetId { get; set; }

    [JsonProperty("description")]
    public string? Description { get; set; }
}   

public class GetDatasetCardsResponse
{
    [JsonProperty("status")]
    public APIStatusMsg? Status { get; set; }

    [JsonProperty("datasetCards")]
    public List<QuantaDatasetDisplay>? DatasetCards { get; set; }
}