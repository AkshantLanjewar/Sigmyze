## Introduction
This file contains the response for the request retreiving all of the organizations a user is a part of.

## Definition
```cs
public class OrganizationRootResp
{
    public APIStatusMsg? msg { get; set; }
    public List<LinkedOrganization>? Organizations { get; set; }
}
```

**Fields**
- `msg` (this is the [status](../api-status.md) message for the request)
- `Organizations` (these are the returned [organizations] for the request)

## JSON Representation
```json
{
    "msg": APIStatusMSG,
    "organizations": LinkedOrganization[]
}