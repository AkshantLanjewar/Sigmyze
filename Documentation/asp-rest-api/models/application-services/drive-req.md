## Introduction
This file contains all the models for POST requests making changes to a users drive. 

## CreateFolderBody
This is the POST request to create a folder within a user's drive.

### Definition
```cs
public class CreateFolderBody
{
    public string? ParentFolder { get; set; }
    public string? FolderName { get; set; }
    public string? OrganizationId { get; set; }
}
```

**Fields**
- `ParentFolder` (this is the parent folder where the folder will be created, root if the drive folder)
- `FolderName` (this is the name of the new folder)
- `OrganizationId` (this is the id of the organization the drive is for)

### JSON Representation
```json
{
    "parent_folder": string,
    "folder_name": string,
    "organization_id": string
}
```

## Delete Folder Body
This is the body for the POST request that deletes a folder from a user's drive.

### Definition
```cs
public class DeleteFolderBody
{
    public string? ParentFolder { get; set; }
    public string? FolderId { get; set; }
    public string? OrganizationId { get; set; }
}
```

**Fields**
- `ParentFolder` (This is the parent folder of the folder that is going to be deleted)
- `FolderId` (This is the id of the folder that is going to be deleted)
- `OrganizationId` (This is the id of the organization the drive belongs too)

### JSON Representation
```json
{
    "parent_folder": string,
    "folder_id": string,
    "organization_id": string
}
```

## UpdateFolderBody
This is the body for the POST request that update's a folders name

### Definition
```cs
public class UpdateFolderBody
{
    public string? ParentFolder { get; set; }
    public string? FolderId { get; set; }
    public string? OrganizationId { get; set; }
    public string? FolderName { get; set; }
}
```

**Fields**
- `ParentFolder` (the id of the parent folder for the targeted folder)
- `FolderId` (the id for the target folder)
- `OrganizationId` (This is the id of the organization the drive belongs too)
- `FolderName` (the new name for the folder)

### JSON Representation
```json
{
    "parent_folder": string,
    "folder_id": string,
    "organization_id": string
    "folder_name": string
}
```

## CreateProjectBody
This is the body of the POST request that handles creating a new project within a user's drive.

### Definition
```cs
public class CreateProjectBody
{
    public string? ParentFolder { get; set; }
    public string? OrganizationId { get; set; }
    public string? ProjectName { get; set; }
    public string? ProjectType { get; set; }
}
```

**Fields**
- `ParentFolder` (the id of the folder for the targeted project will be placed into)
- `OrganizationId` (This is the id of the organization the drive belongs too)
- `ProjectName` (the name for the new project)
- `ProjectType` (the type of project being created, currently supports either lunar or quanta)

### JSON Representation
```json
{
    "parent_folder": string,
    "organization_id": string,
    "project_name": string,
    "project_type": string
}
```
## DeleteProjectBody
this is the body of the POST request that handles deleting a project from a user's drive

### Definition
```cs
public class DeleteProjectBody
{
    public string? ParentFolder { get; set; }
    public string? OrganizationId { get; set; }
    public string? ProjectId { get; set; }
    public string? ProjectType { get; set; }
}
```

**Fields**
- `ParentFolder` (id of the folder the file is in)
- `OrganizationId` (This is the id of the organization the drive belongs too)
- `ProjectId` (the id of the project that is being created)
- `ProjectType` (the type of project being deleted, currently supports either lunar or quanta)

### JSON Representation
```json
{
    "parent_folder": string,
    "organization_id": string,
    "project_id": string,
    "project_type": string
}
```

## UpdateProjectBody
This is the body of the POST request that handles updating a project's name
```cs
public class UpdateProjectBody
{
    public string? ParentFolder { get; set; }
    public string? OrganizationId { get; set; }
    public string? ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public string? ProjectType { get; set; }
}
```

**Fields**
- `ParentFolder` (id of the folder the file is in)
- `OrganizationId` (This is the id of the organization the drive belongs too)
- `ProjectId` (the id of the project that is being updated)
- `ProjectName` (the new name for the project)
- `ProjectType` (the type of project being deleted, currently supports either lunar or quanta)

### JSON Representation
```json
{
    "parent_folder": string,
    "organization_id": string,
    "project_id": string,
    "project_name": string,
    "project_type": string
}
```