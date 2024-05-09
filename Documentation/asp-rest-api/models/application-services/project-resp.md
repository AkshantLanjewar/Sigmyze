## Introduction
This file contains the responses for various endpoitns relating to updating aspects of quanta projects and indicators.

## GetQuantaProjectResp
This is the response to the API call that retreives a quanta project's data.

### Definition
```cs
public class GetQuantaProjectResp
{
    public APIStatusMsg? Status { get; set; }
    public QuantaRepositoryDefinition? ProjectData { get; set; }
}
```

**Fields**
- `Status` (this is the [status](../api-status.md) for the API call)
- `ProjectData` (this is the [project repository]() that was requested in the API call)

### JSON Representation
```json
{
    "status": APIStatusMsg,
    "project_data: QuantaRepositoryDefinition
}
```
## GetQuantaIndicatorsResp
This is the response used when indicators are being requeste dfrom a quanta dataset.

### Definition
```cs
public class GetQuantaIndicatorsResp
{
    public APIStatusMsg? Status { get; set; }
    public List<QuantaIndicator>? Indicators { get; set; }
}
```

**Fields**
- `Status` (this is the [status](../api-status.md) for the API call)
- `Indicators` (these are the [indicators]() returned from the dataset)

### JSON Definition
```json
{
    "status": APIStatusMsg,
    "indicators": QuantaIndicator[]
}
```

## GetQuantaIndicatorsLengthResp
This is the response used for API calls that return the length of a list or query on indicators.

### Definition
```cs
public class GetQuantaIndicatorsLengthResp
{
    public APIStatusMsg? Status { get; set; }
    public int? Length { get; set; }
}
```

**Fields**
- `Status` (this is the [status](../api-status.md) for the API call)
- `Length` (this is the amount of indicators)

### JSON Definition
```json
{
    "status": APIStatusMsg,
    "length": number
}
```