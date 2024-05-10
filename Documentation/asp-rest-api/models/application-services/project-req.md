## Introduction
This file contains all of the POST requests related to the communication between the rust data collection service, and the asp service which interfaces with the database.

## UpdateProjectDataBody
This is the deprecated body to update a pre refresh lunar project.

## UpdateQuantaDataBody
This is the POST body to update the data behind a quanta project, excluding all collected indicators.

### Definition
```cs
public class UpdateQuantaDataBody
{
    public QuantaProjectData? Data { get; set; }
}
```

**Fields**
- `Data` this is the new quanta project [data](./quanta/quanta.md#quantaprojectdata) that has to be synchronized with the database

### JSON Representation
```json
{
    "data": QuantaProjectData
}
```

## AddQuantaIndicator
This is the body of the POST request that add's an indicator to the collected indicators for a quanta dataset.

### Definition
```cs
public class AddQuantaIndicator
{   
    public string? ProcessId { get; set; }
    public string? OrganizationId { get; set; }
    public string? QuantaId { get; set; }
    public List<string>? Indicators { get; set; }
}
```

**Fields**
- `ProcessId` (when every data collection process starts, its assigned a process id as a form of authentication)
- `OrganizationId` (this is the id of the organization the quanta dataset belongs too)
- `QuantaId` (this is the id of the quanta dataset the indicator will be added too)
- `Indicators` (these are the stringified version of the quanta [indicator]() that is going to be added to the dataset)

### JSON Representation
```json
{
    "processId": string,
    "organizationId": string,
    "quantaId": string,
    "indicators": string[]
}
```

## UpdateQuantaIndicatorBody
This is the body of the POST request that handles updating an indicator inside of a quanta dataset from the rust data collection service.

### Definition
```cs
public class UpdateQuantaIndicatorBody
{
    public string? ProcessId { get; set; }
    public string? OrganizationId { get; set; }
    public string? QuantaId { get; set; }
    public List<string>? Indicators { get; set; }
    public string? Mode { get; set; }
}
```

**Fields**
- `ProcessId` (when every data collection process starts, its assigned a process id as a form of authentication)
- `OrganizationId` (this is the id of the organization the quanta dataset belongs too)
- `QuantaId` (this is the id of the quanta dataset the indicator will be added too)
- `Indicators` (these are the stringified version of the quanta [indicator]() that is going to be updated within the dataset)
- `Mode` (the update mode, either replace or append)

**Methods**
```cs
public bool Validate() 
```
This is the function that validates whether or not the body is indeed a valid body ready for a request

### JSON Representation
```json
{
    "processId": string,
    "organizationId": string,
    "quantaId": string,
    "indicators": string[],
    "mode": string
}
```
