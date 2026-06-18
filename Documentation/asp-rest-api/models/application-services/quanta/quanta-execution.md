## Introduction
This file contains all the models related to the ad-hoc execution of a quanta node editor project.

## UploadInternalStoreBody
This is the body of the POST that handles the uploading of the preloaded data in the execution store.

### Definition
```cs
public class UploadInternalStoreBody
{
    public string? PreloadedData { get; set; }
}
```

**Fields**
- `PreloadedData` (this is the internal store after the ad-hoc execution of the project file)

### JSON Representation
```json
{
    "preloadedData": string
}
```

## GetUploadStoreResponse
This is the response to the HTTP request to fetch the preloaded store data from the server

### Definition
```cs
public class GetUploadStoreResponse
{
    public APIStatusMsg? Status { get; set; }
    public List<QuantaInternalStoreWrapper>? Documents { get; set; }
}
```

**Fields**
- `Status` (the [status](../../api-status.md) of the request)
- `Documents` (the returned internal store [nodes](#quantainternalstorewrapper))

## UploadStoreSchema
This is the document stored in the mongodb collection that stores an uploaded internal store in the database.

### Definition
```cs
public class UploadStoreSchema
{
    public string? Id { get; set; }
    public string? Token { get; set; }
    public string? Chunk { get; set; }
}
```

**Fields**
- `Id` (the mongodb document id)
- `Token` (the token given to the rust process)
- `Chunk` (the stringified store stored)

## QuantaInternalStoreWrapper
This is the object version of what is stored in the database, that is parsed by the asp service before being sent back in the request.

### Definition
```cs
public class QuantaInternalStoreWrapper
{
    public string? Value { get; set; }
    public InternalStore? Store { get; set; }
}
```

**Fields**
- `Value` The stored value in the store cell
- `Store` The [node and socket](#internalstore) this value is stored for

## InternalStore
This is the node and socket combination used to tag store values

### Definition
```cs
public class InternalStore
{
    public string? NodeId { get; set; }
    public string? SocketId { get; set; }
}
```

**Fields**
- `NodeId` (id of the node this value is for)
- `SocketId` (id of the output socket this value is for)