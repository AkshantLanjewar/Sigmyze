## Introduction
This file contains all of the details relating to the auth service, which handles basic database operations around users within the platform.

## Definition
```cs
public interface IUserAuth
{
    Task<List<User>> GetAsync();
    Task<User?> GetAsync(string lunarId);
    Task<User?> GetAsyncEmail(string email);
    Task<User?> GetAsyncToken(string token);
    Task CreateAsync(User newUser);
    Task UpdateAsync(string lunarId, User updatedUser);
    Task UpdateAsyncToken(string token, User updatedUser);
    Task RemoveAsync(string lunarId);
}
```

## Methods

### GetAsync (async)
```cs
Task<List<User>> GetAsync();
```
This is the function that returns all of the users in the user document collection in mongodb.

**Returns**: This function returns a list of [users](../../models/user/user.md#definition) within the mongodb collection

### GetAsync(lunarId) (async)
```cs
Task<User?> GetAsync(string lunarId);
```
This is the function that returns a [user](../../models/user/user.md#definition) by querying its lunarId field.

**Parameters**
- `lunarId` (the lunar id of the user)

**Returns**: This function returns a stored [user](../../models/user/user.md#definition) if a user is found, `null` otherwise

### GetAsyncEmail (async)
```cs
Task<User?> GetAsyncEmail(string email);
```
This is the function that returns a [user](../../models/user/user.md#definition) by querying by email.

**Parameters**
- `email` (the email of the user)

**Returns**: This function returns a stored [user](../../models/user/user.md#definition) if a user is found, `null` otherwise

### GetAsyncToken (async)
```cs
Task<User?> GetAsyncToken(string token);
```
This is the function that returns a [user](../../models/user/user.md#definition) by querying by its token.

**Parameters**
- `token` (this is the token that we are querying with)

**Returns**: This function returns a stored [user](../../models/user/user.md#definition) if a user is found, `null` otherwise

### CreateAsync (async)
```cs
Task CreateAsync(User newUser);
```

**Parameters**
- `newUser` (this is the [user](../../models/user/user.md) that is to be inserted into the collection)

### UpdateAsync (async)
```cs
Task UpdateAsync(string lunarId, User updatedUser);
```
This is the function that updates a user's user data by using the user's user id

**Parameters**
- `lunarId` (this is the lunarId for the user we are updating)
- `updatedUser` (this is the new [user data](../../models/user/user.md) for the user)

### UpdateAsyncToken (async)
```cs
Task UpdateAsyncToken(string token, User updatedUser);
```
This is the same function as above, just instead querying by the user's token.

**Parameters**
- `token` (this is the token for the user we are updating)
- `updatedUser` (this is the new [user data](../../models/user/user.md) for the user)

### RemoveAsync (async)
```cs
Task RemoveAsync(string lunarId);
```
This is the function that deletes a user by using its user id.

**Parameters**
- `lunarId` (the user id for the user that is going to be deleted)