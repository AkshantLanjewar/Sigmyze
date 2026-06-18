## Introduction
This is the documentation for the services that handles operations on organizations within the database.

## Definition
```cs
public interface IOrganizationRepository 
{
    Task<List<Organization>> GetAllAsync();
    Task<Organization?> GetOrganization(string organization_id);
    Task InsertOrganization(Organization organization);
    Task UpdateOrganization(string organization_id, Organization nOrganization);
    Task DeleteOrganization(string organization_id);
    Task<bool> WithinOrganization(string organizationId, string lunarId);
}
```

## Methods
### GetAllAsync (async)
```cs
Task<List<Organization>> GetAllAsync();
```
This is the function that returns all of the organizations that are stored in the collection.

**Returns**: Returns a list of [organizations](../models/application-services/organization-data/organization.md) that are stored on the DB

### GetOrganization (async)
```cs
Task<Organization?> GetOrganization(string organization_id);
```
This is the function that queries an organization by its organization id

**Parameters**
- `organization_id` (this is the id of the organization that is being queried)

**Returns**: This function returns the queries [organization](../models/application-services/organization-data/organization.md) if found, `null` otherwise

### InsertOrganization (async)
```cs
Task InsertOrganization(Organization organization);
```
This is the function that inserts a new organization into the mongodb collection

**Parameters**
- `organization` (the [organization](../models/application-services/organization-data/organization.md) that is being inserted)

### UpdateOrganization (async)
```cs
Task UpdateOrganization(string organization_id, Organization nOrganization);
```
This is the function that updates an organization based on its organization id

**Parameters**
- `organization_id` (this is the id of the organization that is being updated)
- `nOrganization` (this is the updated [organization data](../models/application-services/organization-data/organization.md) )

### DeleteOrganization (async)
```cs
Task DeleteOrganization(string organization_id);
```
This is the function that deletes an organization from the collection based on its id

**Parameters**
- `organization_id` (the id of the organization that is being deleted)


### WithinOrganization (async)
```cs
Task<bool> WithinOrganization(string organizationId, string lunarId);
```
This is the function that checks if a user id is a part of an organization

**Parameters**
- `organization_id` (the id of the organization we are querying)
- `lunarId` (the user id we are checking)

**Returns**: this function returns a boolean value based on whether or not the user is a part of the organization