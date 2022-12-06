# ITokenDataService
The token data serivce handles extraction of data from the user jwt token.
Currently its only responsible for retrieving their lunar_id.

## Implementation
```cs
public interface ITokenDataService
{
    string ExtractLunarID(string token);
}
```

## Methods

### ExtractLunarID(string token)
`string`
> Returns the lunar_id from the jwt token