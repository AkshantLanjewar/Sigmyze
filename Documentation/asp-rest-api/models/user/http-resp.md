## Introduction
This file contains the structure for all of the responses to user authentication requests within the platform.

## AuthResp
This is the response to a request to login / authenticate into the platform.

### Definition
```cs
public class AuthResp
{
    public bool Authorized { get; set; }
    public string? Token { get; set; }
    public string? Message { get; set; }
    public string? Verified { get; set; }
    public string? Role { get; set; }
    public string? LunarId { get; set; }
}
```

**Fields**
- `Authorized` (whether or not the authorization was successful)
- `Token` (the authorization token to be saved by the client)
- `Message` (the message from the authentication request)
- `Verified` (whether or not the user who has just authenticated is verified)
- `Role` (the role the user has within the sigmyze platform)
- `LunarId` (the user id for the user within the platform)

## RegisterResp
This is the response to a request to registering a new user into the platform.

### Definition
```cs
public class RegisterResp
{
    public bool Registered { get; set; }
    public string? Message { get; set; }
    public string? Token { get; set; }
    public string? LunarId { get; set; }
}
```

**Fields**
- `Registered` (whether or not the user was successfully registered)
- `Message` (the message returned from the endpoint)
- `Token` (the token for the authenticated user)
- `LunarId` (this is the new user id for the registered user)

## LogoutResp
This is the response to the endpoint that logs out a user from the platform.

### Definition
```cs
public class LogoutResp
{
    public bool LoggedOut { get; set; }
    public string? Message { get; set; }
}
```

**Fields**
- `LoggedOut` (whether or not the logout operation was successful)
- `Message` (the message from the endpoint for the status of the request)

## VerifyResp
This is the response to the endpoint that handles the verification user

### Definition
```cs
public class VerifyResp
{
    public bool Verified { get; set; }
    public string? Message { get; set; }
    public string Token { get; set; }
}
```

**Fields**
- `Verified` (whether or not the verification was successful)
- `Message` (the message for on the status of the request)
- `Token` (the new JWT authentication token for the user)

## ResendResp
This is the response to the endpoint that handles resending the verification code to a user

### Definition
```cs
public class ResendResp
{
    public bool Resent { get; set; }
}
```

**Fields**
- `Resent` (whether or not the verification code was resent to the user)

## UserDataResp
This is the response to the request that receives the basic user data for a user within the platform

### Definition
```cs
public class UserDataResp
{
    public string Username { get; set; }
    public string EMail { get; set; }
    public string Verified { get; set; }
    public string Role { get; set; }
}
```

**Fields**
- `Username` (this is the username for the user)
- `EMail` (this is the users email)
- `Verified` (whether or not the user is verified)
- `Role` (this is the user's role within the platform)