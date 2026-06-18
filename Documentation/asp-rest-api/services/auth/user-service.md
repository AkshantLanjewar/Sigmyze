## Introduction
This document serves as an overview to the service that handles the authentication and registration of users on the platform.

## Definition
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

### Authenticate (async)
```cs
Task<AuthResp> Authenticate(LoginPost data, string? ipAddress);
```
This is the function that handles authentication a user into the platform.

**Parameters**
- `data` (this is the [form data](../../models/user/http-recv.md#loginpost) that was handed over to the login endpoint)
- `ipAddress` (this is the ipaddress for the ip that is logging into the platform)

**Returns**: This function returns the [AuthResp](../../models/user/http-resp.md#authresp) datastructure, with the following messages
- `auth` (the user has successfully authenticated into the platform)
- `pwd_bad` (the password did not match up with the user within the database)
- `user_dne` (the user does not exist within our platform)

### RefreshToken (async)
```cs
Task<AuthResp> RefreshToken(string token, string? ipAddress);
```
This is the function that handles refreshing an expired token so that an active user can stay authenticated on the website without having to re login.

**Parameters**
- `token` (this is the token that is about to expire)
- `ipAddress` (this is the ip address that is requesting their token to be refreshed)

**Returns**: This function returns the [AuthResp](../../models/user/http-resp.md#authresp) datastructure, with the following messages
- `refreshed` (the token has been successfully refreshed by the service)
- `token_n_active` (the token has already expired and cannot be refreshed)
- `token_dne` (the token does not exist within our system)

### RevokeToken (async)
```cs
Task<bool> RevokeToken(string token, string? ipAddress);
```
This is the function that handles revoking an active token, so that a user may log out from the platform.

**Parameters**
- `token` (this is the token that is being revoked)
- `ipAddress` (this is the ip address that is requesting that this token is to be revoked)

**Returns**: This function returns a boolean value on whether or not the logout operation was successful.

### generateJwtToken
```cs
string generateJwtToken(User user);
```
This is the function that handles the generation of a new JWT authentication token, given a user profile

**Parameters**
- `user` (this is the [user](../../models/user/user.md#definition) that the JWT token is being generated for)

**Returns**: this function returns a string which is the new JWT authentication token that was generated

### Register
```cs
(User user, string token) Register(User data, string? ipAddress);
```
This is the function that handles assigning a freshly registered user their first refresh token, as well as their first authentication token.

**Parameters**
- `data` (this is the newly registered user)
- `ipAddress` (this is the ipAddress making the function call)

**Returns**: this function returns a tuple with pos 0 being the user with their new refresh token, and pos 1 being the authentication token that was generated.