# Indicator
The indicator object holds the actual time-series data.

## Concept
The indicator object is the final layer of the dataset schema.
This holds the actual time-series data behind each indicator.

## Implementation
```cs
public class DatasetIndicator
{
    public string? IndicatorID { get; set; }

    public string? IndicatorUnits { get; set; }

    public string? IndicatorName { get; set; }

    public string? IndicatorCategory { get; set; }

    public List<DatasetData>? IndicatorData { get; set; }
}
```

## Members

### IndicatorID (indicator_id)
`string?`
> This is the access_id for the indicator

### IndicatorUnits
`string?`
> Theese are the units used by the indicator

### IndicatorName
`string?`
> This is the full name of the indicator

### IndicatorCategory
`string?`
> This is the category that the indicator belongs too

### IndicatorData
`List<DatasetData>?`
> The [raw data](#datasetdata-subclass) for the indicator

## DatasetData (subclass)
The data for an indicator

### Implementation
```cs
public class DatasetData
{
    public DateTime? Year { get; set; }

    public float? Value { get; set; }

    public bool? Projection { get; set; }
}
```

### Members

#### Year
`DateTime?`
> This is the date of the data point

#### Value
`float?`
> This is the value of the data point

#### Projection
`bool`
> Not used currently, but check to see if datapoint was measured or is a projection