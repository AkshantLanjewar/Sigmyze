## Introduction
This file contains all of the data models related to the filesystem that is implemented for the Lunar Refresh project editor

## SimpleFolder
This is the version of a folder that is stored on the database in order to persist the lunar project data to db.

### Definition
```cs
public class SimpleFolder
{
    public string? FolderName { get; set; }
    public string? FolderId { get; set; }
    public List<SimpleFolder>? Folders { get; set; }
    public List<string>? Files { get; set; }
}
```

**Fields**
- `FolderName` (this is the name for the folder, used for display purposes)
- `FolderId` (this is the id assigned at creation, used for query purposes)
- `Folders` (these are all the child subfolders for this folder)
- `Files` (these are all the files that are stored in this folder, note only the file id's are stored, as other info is reconstructed from project data)

**Methods**
```cs
public List<string> GetAllFileIds()
```
This is the function that returns all of the file id's that this folder contains.

```cs
private bool NullCheck()
```
This is the function that performs a null check to see if the model is a valid datastructure.

```cs
public bool Validate()
```
This is the function that recursively validates all folders and subfolders.

## SimpleFilesystem
This is the model that holds the filesystem for a lunar refresh project.

### Definition
```cs
public class SimpleFilesystem
{
    public List<SimpleFolder>? Folders { get; set; }
    public List<string>? Files { get; set; }
}
```

**Fields**
- `Folders` (these are the [folders](#simplefolder) within the root of the filesystem)
- `Files` (these are the files stored in the root of the filesystem)

**Methods**
```cs
private List<string> GetAllFileIds()
```
This is the function that recursively returns all of the file id's within the filesystem.

```cs
public bool ShallowValidate()
```
This is the function that null check validates the filesystem recursively

```cs
public bool Validate(string projectName, List<LunarChart> charts, List<LunarNote> notes)
```
This is the function that validates a filesystem given the notes and charts created in the lunar refresh project.

*parameters*
- `charts` (these are the [charts](./lunar-chart.md#lunarchart) within the refresh project)
- `notes` (these are the [notes](./lunar-note.md#lunarnote) within the refresh project)