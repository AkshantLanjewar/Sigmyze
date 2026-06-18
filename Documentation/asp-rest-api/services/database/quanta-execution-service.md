## Introduction
This file contains the service that handles uploading the store body to the database, as well as retreiving and then cleaning it up once it is done.

## Definition
```cs
public interface IQuantaExecutionService
{
    Task<string> UploadBody(string preloadedData);
    Task<List<QuantaInternalStoreWrapper>?> GetBody(string token);
    Task DeleteUpload(string token);
}
```

## Methods
### UploadBody (async)
```cs
Task<string> UploadBody(string preloadedData);
```
This is the function that uploads a preloaded internal store wrapper to the mongodb database.

**Parameters**
- `preloadedData` (this is the data needs to be loaded onto the database for the rust service)

**Returns**: This function returns the access token used to get the data from the db

### GetBody (async)
```cs
Task<List<QuantaInternalStoreWrapper>?> GetBody(string token);
```
This is the function that returns the body from the server given the access token

**Parameters**
- `token` (this is the access token used to retreive the data)

**Returns**: This function returns a "list" of [internal store wrappers](../../models/application-services/quanta/quanta-execution.md#quantainternalstorewrapper) where there is only 1 element if the token is found.

### DeleteUpload (async)
```cs
Task DeleteUpload(string token);
```
This is the function that deletes the uploaded data within the database.

**Parameters**
- `token` (this is the token whose data is being deleted)