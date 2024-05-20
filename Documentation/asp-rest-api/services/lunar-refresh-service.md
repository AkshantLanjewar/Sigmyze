## Introduction
This file contains the documentation for the lunar refresh service, which handles all operations for lunar refresh projects on the database.

## Definition
```cs
public interface ILunarRefreshService 
{
    public Task<string?> CreateProject(string organizationId, string projectId, string name);
    public Task DeleteProject(string organizationId, string projectId);
    public Task<LunarProjectData?> GetProjectData(string organizationId, string projectId); 
    public Task UpdateFileTree(string organizationId, string projectId, SimpleFilesystem newFileTre);
    public Task UpdateChart(string organizationId, string projectId, List<LunarChart> newCharts);
    public Task UpdateNote(string organizationId, string projectId, List<LunarNote> newNotes);
    public Task UpdateName(string organizationId, string projectId, string name);
}
```

## Methods
### CreateProject (async)
```cs
public Task<string?> CreateProject(string organizationId, string projectId, string name);
```
This is the function that handles the creation of a new lunar refresh project on the mongodb database. 

**Parameters**
- `organizationId` (this is the id of the organization the lunar refresh project belongs too)
- `projectId` (the id of the project that is to be created)
- `name` (the name for the lunar refresh project)

**Returns**: if the project id given matches a project in the db, this function returns the new project id, `null` otherwise

### DeleteProject (async)
```cs
public Task DeleteProject(string organizationId, string projectId);
```
This is the function that deletes a lunar refresh project from the database collection

**Parameters**
- `organizationId` (this is the id of the organization the project belongs too)
- `projectId` (this is the id of the project that is being deleted)

### GetProjectData (async)
```cs
public Task<LunarProjectData?> GetProjectData(string organizationId, string projectId); 
```
This is the function that retreives the lunar refresh project data from the collection.

**Parameters**
- `organizationId` (this is the id of the organization the lunar refresh project belongs too)
- `projectId` (this is the id of the project that is being queried)

**Returns**: This function returns the refresh project data

### UpdateFileTree (async)
```cs
public Task UpdateFileTree(string organizationId, string projectId, SimpleFilesystem newFileTre);
```
This is the function that updates a lunar refresh project's file tree 

**Parameters**
- `organizationId` (this is the id of the organization the lunar refresh project belongs too)
- `projectId` (this is the id of the project that is being updated)
- `newFileTree` (the new [file tree](../models/lunar/filesystem.md#simplefilesystem) for the lunar refresh project)

### UpdateChart (async)
```cs
public Task UpdateChart(string organizationId, string projectId, List<LunarChart> newCharts);
```
This is the function that updates the chart's within a lunar refresh project

**Parameters**
- `organizationId` (this is the id of the organization the lunar refresh project belongs too)
- `projectId` (this is the id of the project that is being updated)
- `newCharts` (the new [charts](../models/lunar/lunar-chart.md#lunarchart) for the lunar project)

### UpdateNote (async)
```cs
public Task UpdateNote(string organizationId, string projectId, List<LunarNote> newNotes);
```
This is the function that updates the note's within a lunar refresh project

**Parameters**
- `organizationId` (this is the id of the organization the lunar refresh project belongs too)
- `projectId` (this is the id of the project that is being updated)
- `newNotes` (these are the new [notes](../models/lunar/lunar-note.md) for the lunar refresh project)

### UpdateName (async)
```cs
public Task UpdateName(string organizationId, string projectId, string name);
```
This is the function that handles updating the name of a lunar refresh project.

**Parameters**
- `organizationId` (this is the id of the organization the lunar refresh project belongs too)
- `projectId` (this is the id of the project that is being updated)
- `name` (the new name for the lunar refresh project)
