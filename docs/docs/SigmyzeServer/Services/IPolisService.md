# IPolisService
The polis service is how the application interacts with the polis collection.
Currently it can create, update, and retreive polis objects from the database.

## Implementation
```cs
public interface IPolisService
{
    Task<Polis?> GetPolis(string polisId);

    Task CreatePolis(Polis polis);

    Task SavePolis(string polisId, Polis polis);
}
```

## Methods

### GetPolis(string polisId)
`Task<Polis?>`
> This function retreives the polis from the database if it does not exist.

### CreatePolis(Polis polis)
`Task`
> This function inserts a polis into the database

### SavePolis(string polisId, Polis polis)
`Task`
> This function updates a polis based on the given polisId