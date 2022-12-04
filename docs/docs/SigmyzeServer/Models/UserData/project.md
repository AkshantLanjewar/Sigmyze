# Project
Default project type that contains documents and charts

## Concept
The concept behind the project is as the base for the apps functionality.
It stores indicators used and documents.
If the page has publishing capabilities, documents can be published into articles.

## Implementation
```cs
public class Project
{
    public string? ProjectID { get; set; }

    public string? OrganizationId { get; set; }

    public string? ProjectType { get; set; }

    public string? ProjectName { get; set; }

    public ProjectData? ProjectData { get; set; }
}
```

## Members

### ProjectID (project_id)
`string?`
> Id of the project assigned at creation

### OrganizationId (organization_id)
`string?`
> The organization the project was created under

### ProjectType (project_type)
`string?`
> The type of project that was created

### ProjectName (project_name)
`string?`
> Name of the project

### ProjectData (project_data)
`ProjectData?`
> Data stored within the project.

## ProjectData (subclass)
Components within the project

### Implementation
```cs
public class ProjectData
{   
    public List<ProjectIndicator>? Indicators { get; set; }

    public List<Document>? Documents { get; set; }
}
```

### Members

#### Indicators
`List<ProjectIndicator>?`
> List of indicators used in project

#### Documents
`List<Document>?`
> List of documentcs created in project