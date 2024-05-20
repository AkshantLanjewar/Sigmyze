## Introduction
This file contains the documentation on the quanta dataset service, which encapsulates operations around creating public mappings, retreiving tokens, and checking if quanta id's exist.

## Definition
```cs
public interface IQuantaDatasetService
{
    Task<string> CreateQuantaMapping(string quantaId);
    Task<string?> GetQuantaId(string token);
    Task DeleteMapping(string token);
    Task<bool> QuantaIdExists(string quantaId);
    Task<string?> GetToken(string quantaId);
}
```

## Methods
### CreateQuantaMapping (async)
```cs
Task<string> CreateQuantaMapping(string quantaId);
```
This is the function that creates a token to access a private quanta id from the rust service.

**Parameters**
- `quantaId` (the id of the dataset the token is being created for)

**Returns**: This function returns a string, which is the token that is used to access the dataset publicly

### GetQuantaId (async)
```cs
Task<string?> GetQuantaId(string token);
```
This is the function to retreive the underlying quanta id given an access token.

**Parameters**
- `token` (this is the token whose dataset we are searching for)

**Returns**: This function returns a string, which is the quanta id if the token is found, `null` otherwise

### DeleteMapping (async)
```cs
Task DeleteMapping(string token);
```
This is the function that removes an access token from the collection

**Parameters**
- `token` (this is the access token that is being deleted)

### QuantaIdExists (async)
```cs
Task<bool> QuantaIdExists(string quantaId);
```
This is the function that checks if a quanta id has an access token / public id

**Parameters**
- `quantaId` (this is the quanta id we are checking)

**Returns**: this function returns a boolean value based on whether or not the quanta id has a public access token

### GetToken (async)
```cs
Task<string?> GetToken(string quantaId);
```
This is the function to returns a quanta id's public access token

**Parameters**
- `quantaId` (this is the quanta id whose public access token we are searching for)

**Returns**: This returns the public access token if found, `null` otherwise