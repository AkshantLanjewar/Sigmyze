## Introduction
This file contains the documentation for all the models relating to quanta indicators within the sigmyze platform.

## QuantaIndicatorRepositoryDef
This is the document in the indicator collection that stores the central repository of indicator chunks for a particular quanta dataset.

### Definition
```cs
public class QuantaIndicatorRepositoryDef
{
    public string? Id { get; set; }
    public string? QuantaId { get; set; }
    public List<QuantaIndicator>? ProjectIndicators { get; set; }
    public List<string>? IndicatorChunks { get; set; }
}
```

**Fields**
- `Id` (the mongodb document id)
- `QuantaId` (the id of the dataset these chunks of indicators belong too)
- `ProjectIndicators` (DEPRECATED)
- `IndicatorChunks` (these are the ids of all the [chunks](#quantaindicatorchunk) that contain indicators for this dataset)

## QuantaIndicatorChunk
This is the definition for the document that stores a chunk of indicators for a dataset.

### Definition
```cs
public class QuantaIndicatorChunk
{
    public string? Id { get; set; }
    public string? QuantaId { get; set; }
    public string? ChunkId { get; set; }
    public List<QuantaIndicator>? ProjectIndicators { get; set; }
}
```

**Fields**
- `Id` (the mongodb document id)
- `QuantaId` (the dataset id this chunk of indicators belong too)
- `ChunkId` (the id of the chunk within the dataset)
- `ProjectIndicators` (the [indicators](#quantaindicator) that are stored within this chunk)

**Methods**
```cs
public int IndicatorIndex(string indicatorId)
```
This is the method to get the index of an indicator within the chunk

## QuantaIndicator
This is the definition for an indicator within the sigmyze platform

### Definition
```cs
public class QuantaIndicator
{
    public DatasetField? Field { get; set; }
    public List<ChartData>? ChartData { get; set; }
    public string? IndicatorId { get; set; }
    public string? ChunkId { get; set; }
}
```

**Fields**
- `Field` (These are the indicator [fields](#datasetfield) that can be used to query the indicator)
- `ChartData` (This is the raw [timeseries data](#chartdata) for the indicator)
- `IndicatorId` (this is the id of the indicator)
- `ChunkId` (this is the id of the chunk this indicator belongs too)

## DatasetField
These are the queryable fields for an indicator

### Definition
```cs
public class DatasetField
{
    public List<DatasetFieldItem>? DatasetFields { get; set; }
}
```

**Fields**
- `DatasetFields` (these are the [fields](#datasetfielditem) for the indicator)

**Methods**
```cs
public List<QuantaQuery>? ToQuery()
```
This is the method to convert all the fields in this dataset to a query

## DatasetFieldItem
This is the model for a item in an indicator's dataset fields

### Definition
```cs
public class DatasetFieldItem
{
    public string? FieldKey { get; set; }
    public string? FieldType { get; set; }
    public string? StringField { get; set; }
    public int? DateField { get; set; }
}
```

**Fields**
- `FieldKey` (the key to access this field)
- `FieldType` (the type of value in the field, can be date or string)
- `StringField` (if its a string field, this is where the value lies)
- `DateField` (if its a date field, this is where the value lies)

## ChartData
This is the model for the raw timeseries data in an indicator

### Definition
```cs
public class ChartData
{
    public int? XValue { get; set; }
    public float? YValue { get; set; }
    public bool? IsProjection { get; set; }
}
```

**Fields**
- `XValue` (the x value, usually date)
- `YValue` (the y value)
- `IsProjection` (whether or not this data point was collected or generated)