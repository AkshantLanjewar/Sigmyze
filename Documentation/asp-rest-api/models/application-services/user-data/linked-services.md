## Introduction
This file contains the model definiton for the model that links an org id to a name

## Definition
```cs
public class LinkedOrganization
{
    public string? OrganizationId { get; set; }
    public string? OrganizationName { get; set; }
}
```

**Fields**
- `OrganizationId` (the id for the organization)
- `OrganizationName` (the organization's name)