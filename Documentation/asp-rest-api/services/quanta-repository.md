## Introduction
This file contains all of the documentation for the quanta repository service, which handles all basic DB operations for a quanta project

## Definition
```cs
public interface IQuantaRepository
{
    Task InitQuantaProject(string projectId, string projectName, string organizationId);
    Task DeleteProject(string projectId);
    Task<QuantaProjectCacheId?> GetQuantaProjectCache(string projectId, string processId);
    Task DeleteQuantaProjectCache(string projectId, string processId);
    Task CreateQuantaProjectCache(string organizationId, string projectId, string processId);
    Task<GetIndicatorsQuery?> GetProjectIndicators(string projectId, int page, int pageLen);
    Task<GetProjectDataQuery?> GetProjectData(string projectId);
    Task UpdateProjectData(string projectId, QuantaProjectData data);
    Task<QuantaRepositoryDefinition?> GetQuantaRepository(string quantaId);
}
```

## Methods
### InitQuantaProject (async)
```cs
Task InitQuantaProject(string projectId, string projectName, string organizationId);
```
This is the function that handles the creation of a new quanta editor in the database

**Parameters**
- `projectId` (the assigned project id from the drive project)
- `projectName` (the user defined project name for the project)
- `organizationId` (this is the id of the organization this project belongs too)

### DeleteProject (async)
```cs
Task DeleteProject(string projectId);
```
This is the function that handles deleting a project from the collection.

**Parameters**
- `projectId` (the id of the quanta project that is going to be deleted)

### GetQuantaProjectCache (async)
```cs
Task<QuantaProjectCacheId?> GetQuantaProjectCache(string projectId, string processId);
```
This is the function that returns the organization id for a quanta id and a given public access token.

**Parameters**
- `projectId` (the id of the quanta project)
- `processId` (the public access token for the quanta project)

**Returns**: returns the [cache id](../models/application-services/quanta/quanta.md#quantaprojectcacheid) if found, `null` otherwise

### DeleteQuantaProjectCache (async)
```cs
Task DeleteQuantaProjectCache(string projectId, string processId);
```
This is the function that deletes a quanta project's cache

**Parameters**
- `projectId` (the quanta project whose cache we are deleting)
- `processId` (this is the public access token that was created)

### CreateQuantaProjectCache (async)
```cs
Task CreateQuantaProjectCache(string organizationId, string projectId, string processId);
```
This is the function that handles creating a cache for a public access token to anonymously access a quanta id.

**Parameters**
- `organizationId` (the id of the organization the dataset belongs too)
- `projectId` (the id of the project getting a public access token)
- `processId` (the new public access token for the project)

### GetProjectIndicators (async)
```cs
Task<GetIndicatorsQuery?> GetProjectIndicators(string projectId, int page, int pageLen);
```
This is the function that pages the entire list of indicators within a dataset.

**Parameters**
- `projectId` (the id of the dataset being queried)
- `page` (this is the index of the page)
- `pageLen` (this is the size of the page, aka how many indicators are returned per request)


**Returns**: this function returns the [get indicators response](../models/application-services/queries/quanta-queries.md#getindicatorsquery) with the requested indicators

### GetProjectData (async)
```cs
Task<GetProjectDataQuery?> GetProjectData(string projectId);
```
This is the function that returns the quanta editor data for the project

**Parameters**
- `projectId` (this is the id of the quanta project)

**Returns**: Returns the [editor data](../models/application-services/queries/quanta-queries.md#getprojectdataquery) for the project

### UpdateProjectData (async)
```cs
Task UpdateProjectData(string projectId, QuantaProjectData data);
```
This is the function that updates a quanta project's data on the database

**Parameters**
- `projectId` (this is the id of the project that is being updated)
- `data` (this is the [project data](../models/application-services/quanta/quanta.md#quantaprojectdata) that is being updated on the database)

### GetQuantaRepository
```cs
Task<QuantaRepositoryDefinition?> GetQuantaRepository(string quantaId);
```
This the function that returns the quanta editor project data, DEPRECATED