# Folder
Organizational utility that contains drive data.

## Concept
The concept behind the folder is as an organizational utility to the user.
Users can create their own drive structure similar to a file system.
This makes it easier to organize projects and other stored data.

## Implementation
```cs
public class Folder
{
    public string? FolderName { get; set; }

    public string? FolderID { get; set; }

    public string? Starred { get; set; }

    public List<Folder>? Folders { get; set; }

    public List<Project>? Projects { get; set; }
}
```

## Members

### FolderName (folder_name)
`string?`
> Name of the folder

### FolderID (folder_id)
`string?`
> ID of the folder assigned at creation

### Starred
`string?`
> Check if it is starred (Not Implemented ATM)

### Folders
`List<Folder>?`
> Subfolders

### Projects
`List<Project>?`
> Projects within the folder 