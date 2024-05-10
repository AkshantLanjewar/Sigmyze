## Introduction
This file contains all the models related to the data structures used to query the quanta datasets within the sigmyze platform

## QuantaQuery
This is the objcet definition used to add a query parameter to a query

### Definition
```cs
public class QuantaQuery
{
    public string? FieldKey { get; set; }
    public string? FieldType { get; set; }
    public string? StringField { get; set; }
    public int? DateField { get; set; }
    public bool? MultiValue { get; set; }
    public List<string>? StringFields { get; set; }
    public List<int>? DateFields { get; set; }
}
```

**Fields**
- `FieldKey` (the [field key](./quanta-indicator#datasetfielditem) that is being queried)
- `FieldType` (the type of the query)
- `StringField` (if it is a stirng, this is the value)
- `DateField` (if it is a date query, this is the value)
- `MultiValue` (whether or not there are multiple query parameters)
- `StringFields` (these are the multi string values)
- `DateFields` (these are the multi date values)

## QuantaQueryBody
This is the body used to query indicators from the dataset

### Definition
```cs
public class QuantaQueryBody
{
    public List<QuantaQuery>? Params { get; set; }
    public string? QuantaId { get; set; }
}
```

**Fields**
- `Params` (the [query](#quantaquery) parameters)
- `QuantaId` (this is the id of the dataset that is being queried)