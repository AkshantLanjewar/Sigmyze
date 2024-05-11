## Introduction
This file contains the definition for all of the linked service to a user within the platform.

## Definition
```cs
public class UserServiceIndex
{
    public string? Id { get; set; }
    public string? UserId { get; set; }
    public List<LinkedOrganization>? LinkedOrganizations { get; set; }
}
```

**Fields**
- `Id` (mongodb document id for the document)
- `UserId` (the user this index correlates too)
- `LinkedOrganizations` (the [organizations](./linked-services.md) the user is a part of)

**Methods**
```cs
public bool IsInOrganization(string organizationId)
```

This is the function to check if a user is in an organization by its id.