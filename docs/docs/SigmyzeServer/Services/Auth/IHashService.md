# IHashService
This service handles the creation of hashes within the application.

## Implementation
```cs
public interface IHashService
{
    string? GenerateSalt(int nSalt);

    string? HashPassword(string pwd, string? salt, int nIter = 400913, int nHash = 512);
}
```

## Methods

### GenerateSalt(int nSalt)
`string?`
> This generates the salt for the hash.
> Takes in the size of the salt as the parameter.

### HashPassword(string pwd, string? salt, int nIter = 400913, int nHash = 512)
`string?`
> This creates a salted hash that can be stored in the database.
> The pwd field is the plaintext password, salt is the salt, nIter controlls the amount of permutations, 
> and nHash is the size of the hash, which in this case is 512 bytes.