# IOrganizationService
The organization service is the main interface between the 
application and the [organization](../Models/Organization/organization-model.md) collection.

## Implementation
```cs
public interface IOrganizationService
{
	Task<string> CreateUserOrganization(User user);

	Task<Organization?> GetOrganization(string organizationId);

	Task CreateOrganization(Organization organization);

	Task SaveOrganization(Organization organization, string organization_id);
}
```

## Methods

### CreateUserOrganization(User user)
`Task<string>`
> Creates an [organization](../Models/Organization/organization-model.md) for a user <br />
> Note: This acts as a personal [organization](../Models/Organization/organization-model.md), no other users can be added to it

### GetOrganization(string organizationId)
`Task<Organization>?`
> Retreives an [organization](../Models/Organization/organization-model.md) object based on its organization_id

### CreateOrganization(Organization organization)
`Task`
> Creates a new [organization](../Models/Organization/organization-model.md) 

### SaveOrganization(Organization organization, string organization_id)
`Task`
> Updates an existing [organization](../Models/Organization/organization-model.md) based on their organization_id