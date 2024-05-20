## Introduction
This file contains the doumentation for the indicator repository, which handles adding and querying indicators from datasets using a chunked storage strategy.

## Definition
```cs
public interface IQuantaIndicatorRepository
{
    Task<GetIndicatorsQuery?> SelectProjectIndicator(string projectId, List<QuantaQuery> query);
    Task<GetIndicatorsLength?> GetProjectIndicatorsLength(string quantaId);
    Task<GetIndicatorsLength?> SelectProjectIndicatorLength(string projectId, List<QuantaQuery> query);
    Task<GetIndicatorsQuery?> PageSelectedIndicators(string projectId, List<QuantaQuery> query, int page, int pageLen);
    Task<QuantaIndicator?> SelectProjectIndicatorId(string projectId, string indicatorId);
    Task ClearIndicators(string quantaId);
    Task ChunkIndicators(string quantaId, List<QuantaIndicator> indicators);
    Task<string?> SelectorProjectIndicatorChunkId(string quantaId, List<QuantaQuery> query);
    Task UpdateChunk(string chunkId, string mode, List<QuantaIndicator> indicators);
}
```

## Methods
### SelectProjectIndicator (async)
```cs
Task<GetIndicatorsQuery?> SelectProjectIndicator(string projectId, List<QuantaQuery> query);
```
This is the function that queries a dataset for indicators based on the provided query.

**Parameters**
- `projectId` (this is the id of the dataset which we are querying)
- `query` (this is the [query](../models/application-services/quanta/quanta-query.md#quantaquery) for the database)

**Returns**: Returns the [indicators](../models/application-services/queries/quanta-queries.md#getindicatorsquery) that match the query, `null` otherwise

### GetProjectIndicatorsLength (async)
```cs
Task<GetIndicatorsLength?> GetProjectIndicatorsLength(string quantaId);
```
This is the function that returns the total amount of indicators in a particular quanta dataset.

**Parameters**
- `quantaId` (this is the id of the dataset that is being requested)

**Returns**: This returns the [amount](../models/application-services/queries/quanta-queries.md#getindicatorslength) of indicators that are in the dataset, `null` otherwise

### SelectProjectIndicatorLength (async)
```cs
Task<GetIndicatorsLength?> SelectProjectIndicatorLength(string projectId, List<QuantaQuery> query);
```
This is the function that returns the amount of indicators that match a query

**Parameters**
- `projectId` (this is the id of the dataset which we are querying)
- `query` (this is the [query](../models/application-services/quanta/quanta-query.md#quantaquery) for the database)

**Returns**: This returns the [amount](../models/application-services/queries/quanta-queries.md#getindicatorslength) of indicators that are in the dataset that match the query, `null` otherwise

### PageSelectedIndicators (async)
```cs
Task<GetIndicatorsQuery?> PageSelectedIndicators(string projectId, List<QuantaQuery> query, int page, int pageLen);
```
This is the function that pages through a queries result.

**Parameters**
- `projectId` (this is the id of the dataset which we are querying)
- `query` (this is the [query](../models/application-services/quanta/quanta-query.md#quantaquery) for the database)
- `page` (this is the index of the page, aka how many page * pageLen are we away from the 0th indicator)
- `pageLen` (this is the length of the pages we want returned, aka how many indicators are being returned per request)

**Returns**: Returns the [indicators](../models/application-services/queries/quanta-queries.md#getindicatorsquery) that match the query, `null` otherwise

### SelectProjectIndicatorId (async)
```cs
Task<QuantaIndicator?> SelectProjectIndicatorId(string projectId, string indicatorId);
```
This is the function that selects an indicator using its assigned indicator id

**Parameters**
- `projectId` (this is the id for the dataset we are querying)
- `indicatorId` (this is the id of the indicator being requested)

**Returns**: returns the selected [indicator](../models/application-services/quanta/quanta-indicator.md#quantaindicator), `null` otherwise

### ClearIndicators (async)
```cs
Task ClearIndicators(string quantaId);
```
This is the function that removes all of the indicators from a dataset.

**Parameters**
- `quantaId` (this is the id of the dataset whose indicators are being cleared)

### ChunkIndicators (async)
```cs
Task ChunkIndicators(string quantaId, List<QuantaIndicator> indicators);
```
This is the function that handles chunking up an entire batch of quanta indicators so that they may be stored in an optimized format on the database.

**Parameters**
- `quantaId` (the id of the dataset whose indicators are being added)
- `indicators` (these are the indicators to be stored on the database)

### SelectProjectIndicatorChunkId (async)
```cs
Task<string?> SelectorProjectIndicatorChunkId(string quantaId, List<QuantaQuery> query);
```
This is the function to get the chunk id an indicator is stored on 

**Parameters**
- `quantaId` (this is the id of the database we are querying)
- `query` (this is the [query](../models/application-services/quanta/quanta-query.md#quantaquery) to select the indicato)

**Returns**: this function returns a string in the form `{chunk_id}::{indicator_id}` if the indicator is found, `null` otherwise

### UpdateChunk (async)
```cs
Task UpdateChunk(string chunkId, string mode, List<QuantaIndicator> indicators);
```
This is the function that updates a chunk with a new set of indicators

**Parameters**
- `chunkId` (this is the id of the chunk we are updating)
- `mode` (this is the append mode, currently `append` and `replace` are supported)
- `indicators` (these are the new [indicators](../models/application-services/quanta/quanta-indicator.md#quantaindicator) for the chunk)
