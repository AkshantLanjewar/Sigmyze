# Drive
This object is the main data storage unit in the database

## Concept
The concept behind the drive is to store the various different types of data.
Currently both folders and projects can be created. 
Folders are organizational structures, while projects can store documents and chart configurations

## Implementation
```cs
public class Drive 
{
    public string Lunar_ID { get; set; }

    public List<Folder>? Folders { get; set; }

    public List<Project>? RecentlyEditedProjects { get; set; }

    public List<Project>? Projects { get; set; }
}
```

## Members

### Lunar_ID
`string`
> This is the access key for the drive. Either a user_id or an organizations *organization_drive* field

### [Folders](./folder.md) (folders)
`List<Folder>?`
> This is a list of [folders](./folder.md) within the drive 

### RecentlyEditedProjects (recently_edited)
`List<Project>?`
> This is a list of projects that were recently edited (TODO)

### Projects (projects)
`List<Project>?`
> This is a list of the projects in the root directory