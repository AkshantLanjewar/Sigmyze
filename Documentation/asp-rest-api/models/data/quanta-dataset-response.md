## Introduction
This file contains the model that handles the response to the creation of a mapping between a quanta id and a publicly accessible token

## Definition
```cs
public class CreateMappingResponse
{
    public APIStatusMsg? Status { get; set; }
    public string? Token { get; set; }
}
```

**Fields**
- `Status` (the [status](../api-status.md) of the request)
- `Token` (the public token that was created)