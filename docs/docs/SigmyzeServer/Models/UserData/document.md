# Document
Current medium for handling text data. 
Stores content in a block based format, allowing for easy plugin modularity.

## Concept
The concept of the document is to make the creation of documents easier.
Instead of storing data as a continious string of text, text is chunked into blocks.
This allows for easy custom plugin integration while still maintaining a consistent writing flow.

## Implementation
```cs
public class Document
{
    public string? DocumentID { get; set; }

    public string? DataLocation { get; set; }

    public string? DocumentName { get; set; }

    public List<DocumentBlock>? DocumentBlocks { get; set; }
}
```

## Members

### DocumentID (document_id)
`string?`
> ID of the document assigned at creation

### DataLocation (data_location)
`string?`
> DEPRECATED

### DocumentName (document_name)
`string?`
> Name of the Document

### [DocumentBlocks](#documentblock-subclass) (document_blocks)
`List<DocumentBlock>?`
> Actual content of the document

## DocumentBlock (subclass)
This subclass handles the data stored in each block for the document

### Implementation
```cs
public class DocumentBlock
{
    public string? ID { get; set; }

    public string? HTML { get; set; }

    public string? Tag { get; set; }

    public DocumentData? Data { get; set; }

    public BlockStyles? Styles { get; set; }
}
```

### Members

#### ID (id)
`string?`
> ID of the block assigned at creation

#### HTML (html)
`string?`
> Text content of the block (if a text node)

#### Tag (tag)
`string?`
> tag type of the node

#### Data (data)
`DocumentData?`
> [Data](#documentdata-subclass) for the node itself

#### Styles (styles)
`BlockStyles?`
> [Styles](#blockstyles-subclass) for the individual node

## DocumentData (subclass)
Data storage for a [DocumentBlock](#documentblock-subclass)

### Implementation
```cs
public class DocumentData
{
    public string? Text { get; set; }

    public string? ImageData { get; set; }

    public bool UpdateImage { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public List<DocumentIndicator>? Indicators { get; set; }
}
```

### Members

#### Text (text)
`string?`
> Text content for node

#### ImageData (image_data)
`string?`
> Base64 representation of uploaded image data

#### UpdateImage
`bool`
> Update Image idk (investigate b4 breakage)

#### Title
`string?`
> Title holder, used in chart nodes

#### Description
`string?`
> Description holder, used in chart nodes

#### Indicators
`List<DocumentIndicator>`
> A list of indicators used in the chart node

## BlockStyles (subclass)
Styles that an associated block may have

### Implementation
```cs
public class BlockStyles
{
    public string? Justify { get; set; }

    public BlockStylesSize? Size { get; set; }
}
```

### Members

#### Justify (justify)
`string?`
> This is the justify of the node, either left, right or center

#### Size (size)
`BlockStylesSize?`
> This is the [size](#blockstylessize-subclass) of the image if it is an image node

## BlockStylesSize (subclass)
Width and height of the image block

### Implementation
```cs
public class BlockStylesSize
{
    public float? Width { get; set; }

    public float? Height { get; set; }
}
```

### Members

#### Width (width)
`float?`
> Width of the image in px

#### Height (height)
`float?`
> Height of the image in px