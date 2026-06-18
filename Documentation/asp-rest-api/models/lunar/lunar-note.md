## Introduction
This is the file that contains all of the models relating to a note within a lunar refresh project

## NoteConstants
This model serves as a hub of constants that are meant to validate the data structures inputted into the system.

### Definition
```cs
public class NoteConstants
{
    public string[] TextBlockTypes { get { return textBlockTypes; } }
    public string[] MediaBlockTypes { get { return mediaBlockTypes; } }
    public string[] BlockTypes { get { return textBlockTypes.Concat(mediaBlockTypes).ToArray(); } }
    public string[] BlockAlignPositions { get { return blockAlignPositions; } }
}
```

**Fields**
- `TextBlockTypes` (these are the types of text blocks available in the lunar note editor)
- `MediaBlockTypes` (these are the types of media blocks available in the lunar note editor)
- `BlockTypes` (these are all the block types offered in the lunar note editor)
- `BlockAlignPositions` (these are the possible alignments for a block in the lunar note editor)

## BlockStyles
This is the data model that holds all of the styling options available for a lunar note block

### Definition
```cs
public class BlockStyles
{
    public bool? Bold { get; set; }
    public bool? Italic { get; set; }
    public bool? StrikeThru { get; set; }
    public string? Align { get; set; }
}
```

**Fields**
- `Bold` (whether or not the text block should be bolded)
- `Italic` (whether or not the text block should be italicized)
- `StrikeThru` (whether or not the text block should be struck through)
- `Align` (the alignment position of the block, as to be present within the [note constants](#noteconstants))

**Methods**
```cs
public bool Validate()
```
This is the function that validates whether or not the block styles are valid, leveraging the constants.

## NoteBlock
This is a block within the lunar note editor

### Definition
```cs
public class NoteBlock
{
    public string? BlockId { get; set; }
    public string? BlockType { get; set; }
    public string? BlockContent { get; set; }
    public bool? IsGroup { get; set; }
    public List<NoteBlock>? BlockChildren { get; set; }
    public BlockStyles? BlockStyles { get; set; }
}
```

**Fields**
- `BlockId` (this is the id of the block, used for querying and editing purposes)
- `BlockType` (This is the type of block, must be present within the [note constants](#noteconstants))
- `BlockContent` (this is the content of the block, stored in string form)
- `IsGroup` (whether or not this block is a parent of child blocks)
- `BlockChildren` (these are the children in the block if the block indeed has children)
- `BlockStyles` (these are the [block styles](#blockstyles) for the block)

**Methods**
```cs
public bool Validate()
```
This is the function to validate whether or not this is a valid note block that can be rendered in the lunar note editor

## LunarNote
This is the datastructure for a lunar note within the lunar refresh editor.

### Definition
```cs
public class LunarNote
{
    public string? Name { get; set; }
    public string? ObjectId { get; set; }
    public List<NoteBlock>? Blocks { get; set; }
}
```

**Fields**
- `Name` (this is the name of the note, used for display purposes)
- `ObjectId` (this is the id of the note, related to the [file id](./filesystem.md#simplefilesystem) in the filesystem)
- `Blocks` (these are the [blocks](#noteblock) within the note)

**Methods**
```cs
public bool Validate()
```
This is the function that validates whether or not a note is valid