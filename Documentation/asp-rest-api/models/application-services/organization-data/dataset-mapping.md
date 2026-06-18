## Introduction
This file contains the MongoDB model for a mapping between a token, and a quanta id. Most commonly, this is used for communication with the rust service, as well as publicly publishing a dataset, as a token is nothing more than just a string.

## Definition
```cs
public class DatasetMap
{
    public string? Id { get; set; }
    public string? Token { get; set; }
    public string? QuantaId { get; set; }
}
```

**Fields**
- `Id` (This is the MongoDB document ID that is assignened when pushed to a collection)
- `Token` (This is the publicly accessible token that maps to a private quanta id dataset)
- `QuantaId` (The id for the quanta project this token is being associated too)

## JSON/BSON Representation
```json
{
    "token": string,
    "quantaId": string
}
```