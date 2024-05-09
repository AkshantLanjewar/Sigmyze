## Introduction
This file contains the base drive and folders needed to store a drive for the user within the platform.


## Drive
This is the BSON document for a drive for an organization.

### Definition
```cs
public class Drive
{
    public string? Id { get; set; }
    public string? DriveId { get; set; }
    public List<ProjectView>? Projects { get; set; }
    public List<Folder>? Folders { get; set; }
}
```

**Fields**
- `Id` (this is the mongodb id for the document that stores this drive)
- `DriveId` (this is the id that is used to query the drive from its collection)
- `Projects` (these are the [projects]() that are in the root of the drive)
- `Folders` (these are the [folders](#folder) within the root of the drive)

## Folder
This is the definition for a folder within a user's drive.

### Definition
```cs
public class Folder
{
    public string? FolderId { get; set; }
    public string? FolderName { get; set; }
    public List<ProjectView>? Projects { get; set; }
    public List<Folder>? Folders { get; set; }
}
```

**Fields**
- `FolderId` (this is the id of the folder, used to query and edit it)
- `FolderName` (name of the folder, used for display purposes)
- `Projects` (these are the projects stored in this folder)
- `Folders` (these are the subfolders within this folder)