namespace SigmyzeServer.Models.Lunar;

using Microsoft.Extensions.ObjectPool;
using MongoDB.Bson.Serialization.Attributes;
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
    [BsonElement("bold")]
    [JsonProperty("bold")]
    [JsonPropertyName("bold")]
    public bool? Bold { get; set; }

    [BsonElement("italic")]
    [JsonProperty("italic")]
    [JsonPropertyName("italic")]
    public bool? Italic { get; set; }

    [BsonElement("strikethru")]
    [JsonProperty("strikethru")]
    [JsonPropertyName("strikethru")]
    public bool? StrikeThru { get; set; }

    [BsonElement("align")]
    [JsonProperty("align")]
    [JsonPropertyName("align")]
    public string? Align { get; set; }

    public bool Validate()
    {
        if(this.Bold == null || this.Italic == null || this.StrikeThru == null || this.Align == null)
            return false;
        if(NoteConstants.blockAlignPositions.Contains(this.Align) == false)
            return false;

        return true;
    }
}

public class NoteBlock
{
    [BsonElement("blockId")]
    [JsonProperty("blockId")]
    [JsonPropertyName("blockId")]
    public string? BlockId { get; set; }

    [BsonElement("blockType")]
    [JsonProperty("blockType")]
    [JsonPropertyName("blockType")]
    public string? BlockType { get; set; }

    [BsonElement("blockContent")]
    [JsonProperty("blockContent")]
    [JsonPropertyName("blockContent")]
    public string? BlockContent { get; set; }

    [BsonElement("isGroup")]
    [JsonProperty("isGroup")]
    [JsonPropertyName("isGroup")]
    public bool? IsGroup { get; set; }

    [BsonElement("blockChildren")]
    [JsonProperty("blockChildren")]
    [JsonPropertyName("blockChildren")]
    public List<NoteBlock>? BlockChildren { get; set; }
    
    [BsonElement("blockStyles")]
    [JsonProperty("blockStyles")]
    [JsonPropertyName("blockStyles")]
    public BlockStyles? BlockStyles { get; set; }

    public bool Validate()
    {
        if(this.BlockId == null || this.BlockType == null || this.BlockContent == null || this.IsGroup == null)
            return false;
        if(this.IsGroup == true && this.BlockChildren == null)
            return false;
        if(NoteConstants.mediaBlockTypes.Contains(this.BlockType) == false && NoteConstants.textBlockTypes.Contains(this.BlockType) == false)
            return false;
        if(this.BlockStyles != null && this.BlockStyles.Validate() == false)
            return false;

        //if the block has children go through and validate the blocks
        if(this.IsGroup == true)
        {
            for(int i = 0; i < this.BlockChildren!.Count; i++)
            {
                NoteBlock block = this.BlockChildren[i];
                if(block.Validate() == false)
                    return false;
            }
        }

        return true;
    }
}

public class LunarNote
{
    [BsonElement("name")]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [BsonElement("objectId")]
    [JsonProperty("objectId")]
    [JsonPropertyName("objectId")]
    public string? ObjectId { get; set; }

    [BsonElement("blocks")]
    [JsonProperty("blocks")]
    [JsonPropertyName("blocks")]
    public List<NoteBlock>? Blocks { get; set; }

    public bool Validate()
    {
        if(this.Name == null || this.ObjectId == null || this.Blocks == null)
            return false;
        if(this.Blocks.Count == 0)
            return false;

        //go through the blocks and validate that they are true
        for(int i = 0; i < this.Blocks.Count; i++) 
        {
            NoteBlock block = this.Blocks[i];
            if(block.Validate() == false)
                return false;
        }

        return true;
    }
}