## Introduction
This file contains the model that stores a user profile on the mongodb database for the platform.

## Definition
```cs
public class User
{
    public string? Id { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? Salt { get; set; }
    public string? LunarId { get; set; }
    public List<string>? Organizations { get; set; }
    public string? EMail { get; set; }
    public string? Verified { get; set; }
    public string? VerificationToken { get; set; }
    public string? Role { get; set; }
    public RefreshToken? RefreshToken { get; set; }
}
```

**Fields**
- `Id` (this is the id for the document that holds the user data)
- `Username` (this is the username for the user)
- `Password` (this is the hashed and salted password for the user)
- `Salt` (this is the salt for the password)
- `LunarId` (this is the assigned user id for the user in the platform)
- `Organizations` (these are the organizations that the user belongs too)
- `EMail` (this is the user's email)
- `Verified` (whether or not this user is verified)
- `VerificationToken` (this is the token to verify this user)
- `Role` (this is the user's role within the platform)
- `RefreshToken` (this is the refresh token for the platform)