## Introduction
This file contains the queries to query the dataset in various ways

## GetIndicatorsQuery
This is the query to retreive indicators from the dataset

### Definition
```cs
public class GetIndicatorsQuery
{
        public List<QuantaIndicator>? Indicators { get; set; }
}
```

**Fields**
- `Indicators` (the [indicators](../quanta/quanta-indicator.md#quantaindicator) that were returned from the query)

## GetIndicatorsLength
This is the query to return how many indicators fit a certain query

### Definition
```cs
public class GetIndicatorsLength
{
    public int? Id { get; set; }
    public int? IndicatorsLength { get; set; }
}
```

**Fields**
- `Id` (the mongodb id artifact from pipeline query)
- `IndicatorsLength` (the amount of indicators that fit the query)

## GetProjectDataQuery
This is the query to return quanta project data

### Definition
```cs
public class GetProjectDataQuery
{
    public string? ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public QuantaProjectData? ProjectData { get; set; }
}
```

**Fields**
- `ProjectId` (the id of the quanta project)
- `ProjectName` (the name of the project)
- `ProjectData` (the [quanta project data](../quanta/quanta.md#quantaprojectdata) for the project)