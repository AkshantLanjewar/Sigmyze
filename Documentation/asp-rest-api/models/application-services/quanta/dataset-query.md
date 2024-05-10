## Introduction
This file contains the body to a POST request that makes a query on a publicly published quanta dataset.

## Definition
```cs
public class DatasetQueryBody
{
    public List<QuantaQuery>? Params { get; set; }
    public string? Token { get; set; }
}
```

**Fields**
- `Params` (these are the specific [query]() options for the request)
- `Token` (this is the public quanta token in order to correctly access the dataset)

## JSON Representation
```json
{
    "params": QuantaQuery[],
    "token": string
}
```