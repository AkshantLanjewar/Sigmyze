## Introduction
This file contains the documentation for the user service repository, which acts as a link between a user profile and all of the organizations that they belong too.

## Definition
```cs
public interface IUserServiceRepository
{
    Task<List<UserServiceIndex>> GetAllAsync();
    Task<UserServiceIndex?> GetUserService(string user_id);
    Task UpdateUserService(string user_id, UserServiceIndex nUserService);
    Task InsertUserService(UserServiceIndex nUserService);
    Task DeleteUserService(string user_id);
}
```

## Methods
### GetAllAsync (async)
```cs
Task<List<UserServiceIndex>> GetAllAsync();
```
This is the function that returns all of the user service index's stored in the collection.

**Returns**: This function returns a list of [user service indexs](../models/application-services/user-data/linked-user-services.md)

### GetUserService (async)
```cs
Task<UserServiceIndex?> GetUserService(string user_id);
```
This is the function to get a user's service index by the user id.

**Parameters**
- `user_id` (this is the id of the user whose index we are querying)

**Returns**: This function returns the [index](../models/application-services/user-data/linked-user-services.md) if found, `null` otherwise

### UpdateUserService (async)
```cs
Task UpdateUserService(string user_id, UserServiceIndex nUserService);
```
This is the function that updates a user service index for a user

**Parameters**
- `user_id` (the id of the user whose service index we are updating)
- `nUserService` (the new [data](../models/application-services/user-data/linked-user-services.md) for the user service)

### InsertUserService (async)
```cs
Task InsertUserService(UserServiceIndex nUserService);
```
This is the function that inserts a new user service index into the collection

**Parameters**
- `nUserService` (this is the new [data](../models/application-services/user-data/linked-user-services.md) to be inserted)

### DeleteUserService (async)
```cs
Task DeleteUserService(string user_id);
```
This is the function that handles deleting a service index from the collection.

**Parameters**
- `user_id` (the id of the service index to be deleted)