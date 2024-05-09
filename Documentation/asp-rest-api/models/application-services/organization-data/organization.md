## Introduction
This file contains the definition for the document that contains all root information for an organization within the platform. The goal of the organization's feature is to have a collaborative editing environment, allowing multiple different people to work on the project at the same time. 

## Definition
```cs
public class Organization
{
    public string? Id { get; set; }
    public string? OrganizationId { get; set; }
    public string? LinkedDriveId { get; set; }
    public string? OrganizationName { get; set; } 
    public List<string>? Users { get; set; }
}
```

**Fields**
- `Id` (This is the ID for the document in the mongodb collection) 
- `OrganizationId` (this is the id for the organization, used to query the collection)
- `LinkedDriveId` (this is the drive that is associated with this organization)
- `OrganizationName` (this is the organization's name, used for display purposes)
- `Users` (this is the list of user ids that are a part of this organization)