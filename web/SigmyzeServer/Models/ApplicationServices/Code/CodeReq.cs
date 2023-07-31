using System.Text.Json.Serialization;

namespace SigmyzeServer.Models.ApplicationServices.Code;

public class CreateQuantaSelectorBody
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("selector_id")]
    public string? SelectorId { get; set; }
}

public class DeleteQuantaSelectorBody
{
    [JsonPropertyName("code_id")]
    public string? CodeId { get; set; }
}