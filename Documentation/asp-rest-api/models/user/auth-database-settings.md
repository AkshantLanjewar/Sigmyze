## Introduction
This file contains the model that holds the connection settings to access the auth database collection.

## Definition
```cs
public class AuthDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string AuthCollectionName { get; set; } = null!;
}
```

**Fields**
- `ConnectionString` (this is the url to connect to the mongodb database, present in conf files)
- `DatabaseName` (this is the name of the user database)
- `AuthCollectionName` (this is the name of the collection within the database)