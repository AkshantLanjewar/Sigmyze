namespace SigmyzeServer.Models.Lunar;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

public class NoteConstants
{
    public static readonly string[] textBlockTypes = { 
        "paragraph", 
        "heading::1", 
        "heading::2", 
        "heading::3",
        "heading::4",
        "heading::5",
        "heading::6"
    };

    public string[] TextBlockTypes { get { return textBlockTypes; } }

    public static readonly string[] mediaBlockTypes = { "media::image", "media::chart" };

    public string[] MediaBlockTypes { get { return mediaBlockTypes; } }
    
    public string[] BlockTypes { get { return textBlockTypes.Concat(mediaBlockTypes).ToArray(); } }

    public static readonly string[] blockAlignPositions = { "left", "center", "right", "justified" };

    public string[] BlockAlignPositions { get { return blockAlignPositions; } }
}

public class BlockStyles 
{
    [JsonProperty("bold")]
    [JsonPropertyName("bold")]
    public bool? Bold { get; set; }

    [JsonProperty("italic")]
    [JsonPropertyName("italic")]
    public bool? Italic { get; set; }

    [JsonProperty("strikethru")]
    [JsonPropertyName("strikethru")]
    public bool? StrikeThru { get; set; }

    [JsonProperty("align")]
    [JsonPropertyName("align")]
    public string? Align { get; set; }

    public bool Validate()
    {
        return true;
    }
}

public class NoteBlock
{
    [JsonProperty("blockId")]
    [JsonPropertyName("blockId")]
    public string? BlockId { get; set; }

    [JsonProperty("blockType")]
    [JsonPropertyName("blockType")]
    public string? BlockType { get; set; }

    [JsonProperty("blockContent")]
    [JsonPropertyName("blockContent")]
    public string? BlockContent { get; set; }

    [JsonProperty("isGroup")]
    [JsonPropertyName("isGroup")]
    public bool? IsGroup { get; set; }

    [JsonProperty("blockChildren")]
    [JsonPropertyName("blockChildren")]
    public List<NoteBlock>? BlockChildren { get; set; }
    
    [JsonProperty("blockStyles")]
    [JsonPropertyName("blockStyles")]
    public BlockStyles? BlockStyles { get; set; }

    public bool Validate()
    {
        return true;
    }
}

public class LunarNote
{
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonProperty("objectId")]
    [JsonPropertyName("objectId")]
    public string? ObjectId { get; set; }

    [JsonProperty("blocks")]
    [JsonPropertyName("blocks")]
    public List<NoteBlock>? Blocks { get; set; }

    public bool Validate()
    {
        return true;
    }
}