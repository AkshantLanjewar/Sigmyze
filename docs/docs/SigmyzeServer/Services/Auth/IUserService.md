# IUserService
This service is how users are authenticated within the system. 
It handles the processing of login credentials, and the creation of tokens to authenticate.
The tokens created contain data that every single protected route can access, such as the 
email or lunar_id.

## Implementation
```cs
public interface IUserService
{
    Task<AuthResp> Authenticate(LoginPost data, string? ipAddress);

    Task<AuthResp> RefreshToken(string token, string? ipAddress);

    Task<bool> RevokeToken(string token, string? ipAddress);

    string generateJwtToken(User user);

    (User user, string token) Register(User data, string? ipAddress);
}
```

## Methods

### Authenticate(LoginPost data, string? ipAddress)
`Task<AuthResp>`
> This method handles the authentication of [users](../../Models/user.md).
> It takes in the raw login post data, and compares the hashed passwords.
> If the user is authenticated, it generates a JWT token for the client to store.

### RefreshToken(string token, string? ipAddress)
`Task<AuthResp>`
> This method handles the refreshing of tokens.
> It checks if the token exists, and if it hasnt expired.
> If those fields pass, it updates the refresh token and generates a new JWT token for the [user](../../Models/user.md).

### RevokeToken(string token, string? ipAddress)
`Task<bool>`
> This methods handles the revoking of tokens.
> It checks if the token exists and that it has not expired.
> If those fields pass, it updates the db with the revoked status, logging the [user](../../Models/user.md) out.

### generateJwtToken(User user)
`string`
> This method handles the generation of the JWT token.
> The JWT token stores data such as: lunar_id, email, username, verified, and role.
> The token expires after 2 hours.

### Register(User data, string? ipAddress)
`(User user, string token)`
> This generates a JWT token for a newly registered [user](../../Models/user.md).