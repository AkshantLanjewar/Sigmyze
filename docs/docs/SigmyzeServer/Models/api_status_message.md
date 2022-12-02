---
sidebar_position: 1
---

# APIStatusMessage
The API status message is appended to each response from an api router.
Currently it has no use, but its planned implementation is to help
client applications handle errors from API requests.

## Implementation
```cs
public class APIStatusMsg
{
    public bool Error { get; set; }

    public string MSG { get; set; }
}
```

## Members

### Error (error)
`boolean`
> Quick check to see if the endpoint was successful or not

### MSG (msg)
`string`
> This is the particular message from a given API Endpoint