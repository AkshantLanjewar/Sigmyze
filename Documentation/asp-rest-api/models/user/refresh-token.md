## Introduction
This file contains the document that stores active refresh tokens within the mongodb database.

## Definition
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

**Fields**
- `Id` (this is the mongodb document id)
- `Token` (this is the token that was assigned)
- `Expires` (when the token expires)
- `Created` (when the token was created)
- `CreatedByIp` (this is the IP address that created this token to use)
- `Revoked` (the time at which this token was revoked, if it was)
- `RevokedByIp` (this is the IP address that revoked this token from use)
- `ReplacedByToken` (this is the token that replaced this token that expired)
- `IsExpired` (whether or not this refresh token is expired)
- `IsActive` (whether or not this is an active refresh token)