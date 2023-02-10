# User
This acts as the model that stores every single user within the database.

## Concept
The concept behind the user is as the source of all user data.
It contains a username, and a unique lunar_id used to identify users.
It also contains a list of linked organizations that the user is a part of.

## Implementation
```cs
public class User
{
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

## Members

### Username (username)
`string`
> This is the username for the user.

### Password (password)
`string`
> This is the salted and hashed form of the password.

### Salt (salt)
`string`
> This is the salt for the password.

### LunarId (lunar_id)
`string`
> This is the unique identifier id for the user. Assigned on creation.

### Organizations (organizations)
`List<string>`
> This is a list of the linked organizations that this user is a part of.

### EMail (email)
`string`
> This is the email associated with the account.

### Verified (verified)
`string`
> Verified state of the user.

### VerificationToken (verification_token)
`string`
> This is the token needed to verify the account.

### Role (role)
`string`
> This is the role of the user. currently not in use.

### RefreshToken (refresh_token)
`RefreshToken`
> This is the information concerning the refresh token.

## RefreshToken (subclass)
This is all the information for refresh tokens when a user is logged in.

### Implementation
```cs
public class RefreshToken
{
    public string? Id { get; set; }

    public string? Token { get; set; }

    public DateTime Expires { get; set; }

    public DateTime Created { get; set; }

    public string? CreatedByIp { get; set; }

    public DateTime? Revoked { get; set; }

    public string? RevokedByIp { get; set; }

    public string? ReplacedByToken { get; set; } 

    public bool IsExpired => DateTime.UtcNow >= Expires;

    public bool IsActive => Revoked == null && !IsExpired;
}
```

### Members

#### Id
`string`
> This is the id for the refresh token.

#### Token
`string`
> This is the raw content of the refresh token

#### Expires
`DateTime`
> This is the datetime object when the refresh token expires

#### Created
`DateTime`
> This is the datetime object when the refresh token was created

#### CreatedByIp
`string`
> This is the ip address that requested the creation of the refresh token.

#### Revoked
`DateTime?`
> This is the datetime object of when the object is revoked. Null if not revoked.

#### RevokedByIp
`string`
> This is the ip address that requested the revokation of the token.

### Methods

#### IsExpired
`bool`
> This returns whether the token is expired or not

#### IsActive
`bool`
> This checks if the token is a valid refresh token