# Organization
The organization object currently handles storing articles

## Concept
The organization object stores all the functionality outside of simple data storage.
Currently its only application is handling the publishing of articles,
which is handled in the respective article queue's.

## Implementation
```cs
public class Organization
{	
	public string? OrganizationId { get; set; }
	
	public string? OrganizationName { get; set; }
	
	public string? OrganizationAdmin { get; set; }
	
	public bool UserOrganization { get; set; }
	
	public string? OrganizationDrive { get; set; }
	
	public List<string>? OrganizationUsers { get; set; }
	
	public List<string>? OrganizationPublishers { get; set; }

	public bool HasPage { get; set; }

	public List<Article>? PublishedQueue { get; set; }

	public List<Article>? Published { get; set; }

	public string? PolisId { get; set; }
}
```

## Members

### OrganizationId (organization_id)
`string?`
> Id of the organization assigned at creation

### OrganizationName (organization_name)
`string?`
> Name of the organization

### OrganizationAdmin (organization_admin)
`string?`
> User id of the organization administrator

### UserOrganization (user_organization)
`bool`
> Check if the organization is meant for just a user or groups of user

### OrganizationDrive (organization_drive)
`string?`
> ID for the Organization's Drive

### OrganizationUsers (organization_users)
`List<string>?`
> A list of users with access to the organization

### OrganizationPublishers (organization_publishers)
`List<string>?`
> A list of users who can publish [articles](./article.md) to organization

### HasPage (has_page)
`bool`
> Checks if organization has page or not

### PublishedQueue (published_queue)
`List<Article>?`
> This is the list of [articles](./article.md) waiting to be approved

### Published (published)
`List<Article>?`
> This is the list of published [articles](./article.md)

### PolisId (polis_id)
`string?`
> This is the ID of the associated polis