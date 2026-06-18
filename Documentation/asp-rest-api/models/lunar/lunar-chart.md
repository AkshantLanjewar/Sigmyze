## Introduction
This file contains all of the data models related to charts within a lunar refresh project.

## QuantaIndicatorLocation
This is the model that details the shorthand way of querying a specific indicator from a dataset.

### Definition
```cs
public class QuantaIndicatorLocation
{
    public string? DatasetId { get; set; }
    public string? IndicatorId { get; set; }
}
```

**Fields**
- `DatasetId` (this is the id for the [dataset](../application-services/quanta/quanta.md) the indicator belongs too)
- `IndicatorId` (this is the id for the [indicator](../application-services/quanta/quanta-indicator.md#quantaindicator) that is in the dataset)

**Methods**
```cs
public bool Validate()
```
This is the function to validate whether or not this is a valid indicator location model.

## LunarChart
This is the model that contains all the data to store a chart that was created within a lunar refresh project.

### Definition
```cs
public class LunarChart
{
    public string? Name { get; set; }
    public string? ObjectId { get; set; }
    public List<QuantaIndicatorLocation>? Indicators { get; set; }
}
```

**Fields**
- `Name` (this is the name for the chart, used for display purposes)
- `ObjectId` (this is the id to access the chart, maps to the file id in a [filesystem](./filesystem.md#simplefilesystem))
- `Indicators` (these are the [indicators](#quantaindicatorlocation) that are in the chart)

**Methods**
```cs
public bool Validate()
```
This is the function that validates whether or not this chart datastructure is valid or not