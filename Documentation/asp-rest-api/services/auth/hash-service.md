## Introduction
This document serves as an overview to the hashing service within the api service, which handles the generation of salts, as well as the hashing of passwords.

## Definition
```cs
public interface IHashService
{
    string? GenerateSalt(int nSalt);
    string? HashPassword(string pwd, string? salt, int nIter = 400913, int nHash = 512);
}
```

## Methods

### GenerateSalt
```cs
string? GenerateSalt(int nSalt);
```
This is the function that handles the generation of a password salt to be used in a password hash

**Parameters**
- `nSalt` (the length of the generated salt in bytes) 

**Preconditions**
- `nSalt > 0`

**Returns**:
This method returns the salt as a string, null if the operation fails

### HashPassword
```cs
string? HashPassword(string pwd, string? salt, int nIter = 400913, int nHash = 512);
```
This is the function that handles hashing a plaintext string with a given salt, allowing the user to control for end hash size and number of hash iterations.

**Parameters**
- `pwd` (this is the string that is going to be hashed)
- `salt` (this is the salt to be used in the hash, cannot be null)
- `nIter` (the amount of iterations done to create the final hash, default value is 400913)
- `nHash` (how long the final hash should be including salt in bytes)

**Preconditions**
- `salt != null`
- `nIter > 0`
- `nHash > 128`

**Returns**:
This method returns a final hash as a string if the function execution was successful, otherwise returns null
