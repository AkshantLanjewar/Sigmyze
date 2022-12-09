# IUserAuth
This serivce is how the application interfaces with the user database.
It handles all CRUD db operations related to users and user data.

## Implementation
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

### GetAsync()
`Task<List<User>>`
> This returns a list of all the [users](../../Models/user.md) in the collection.

### GetAsync(string lunarId)
`Task<User?>`
> This method tries to retreive a [user](../../Models/user.md) based on a given lunarId (null if not found)

### GetAsyncEmail(string email)
`Task<User?>`
> This method tries to retreive a [user](../../Models/user.md) based on a given email (null if not found)

### GetAsyncToken(string token)
`Task<User?>`
> This retrieves a [user](../../Models/user.md) based on the given jwt token (null if not found)

### CreateAsync(User newUser)
`Task`
> This method adds a new [user](../../Models/user.md) to the collection.

### UpdateAsync(string lunarId, User updatedUser)
`Task`
> This updates a [user](../../Models/user.md) with new data by replacing the object in the collection with a matching lunar_id

### UpdateAsyncToken(string token, User updatedUser)
`Task`
> This updates a [user](../../Models/user.md) with new data by replacing the object in the collection with a matching token

### RemoveAsync(string lunarId)
`Task`
> This deletes a [user](../../Models/user.md) from the collection with the matching lunarId