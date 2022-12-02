# Article
The article object is a finalized version of the document object.
It adds key content such as a title, subtitle and image,
while retaining extra fields such as authorship and publishing date.

## Concept
The concept behind the Article is currently as a prebuilt datatype for blogging.
It is created by publishing taking a document, and adding a title, subtitle and image
and publishing it to list of articles in the organization. **Eventually** the Article data type 
is to be converted into a more general publishing type that can be customized and created within
the Lunar editor.

## Implementation
```cs
public class Article
{
	public string? PublishedId { get; set; }

	public string? PublishedTitle { get; set; }

	public string? PublishedSubtitle { get; set; }

	public string? PublishedImage { get; set; }
	
	public DateTime? PublishedDate { get; set; }
	
	public PublicUser? PublicUser { get; set; }
	
	public Document? Content { get; set; }
}
```

## Members

### PublishedId (published_id)
`string?`
> This is a uniqe ID that is assigned when the Article is created

### PublishedTitle (published_title)
`string?`
> This is the title of the published article. **Mandatory field**

### PublishedSubtitle (published_subtitle)
`string?`
> This is the subtitle/description of the published article. **Mandatory field**

### PublishedImage (published_image)
`string?`
> This is the image for the published article. Stored in the base64 binary representation.

### PublishedDate (published_date)
`DateTime?`
> The date when the article object was created. **Mandatory field**

### PublicUser (public_user)
`PublicUser?`
> This is the author of the article. Can be either an individual account or organization. **Mandatory field**

### Content (content)
`Document?`
> This is the actual content that is published within the article. **Mandatory field**