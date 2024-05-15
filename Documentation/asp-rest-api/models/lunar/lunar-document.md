## Introduction
This file contains the document that stores a lunar refresh project on the MongoDB database.

## Definition
```cs
public class LunarDocument
{
    public string? Id { get; set; }
    public string? OrganizationId { get; set; }
    public string? ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public SimpleFilesystem? Filesystem { get; set; }
    public List<LunarNote>? Notes { get; set; }
    public List<LunarChart>? Charts { get; set; }
}
```

**Fields**
- `Id` (this is the MongoDB document id for the document)
- `OrganizationId` (this is the id of the [organization](../application-services/organization-data/organization.md) this project belongs too)
- `ProjectId` (this is the project id to acces this project)
- `ProjectName` (this is the name of the lunar project, used for display purposes)
- `Notes` (these are the [notes](./lunar-note.md) within the refresh project)
- `Charts` (these are the [charts](./lunar-chart.md) within the refresh project)

**Methods**
```cs
public bool ValidateFilesystemName()
```
This is the function that validates that all the charts and notes in the object are represented in the filesystem.

```cs
public bool NullCheck()
```
This is the function that nullchecks the model

```cs
public bool Validate()
```
This is the function that completes the null check and the filesystem verification check.