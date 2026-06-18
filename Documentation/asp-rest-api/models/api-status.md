## Introduction
The API status file contains the definition for the `APIStatusMsg` model, which is the basic status message sent with every response from the REST api. 

## Definition
```cs
public class APIStatusMsg
{
    public bool Error { get; set; }

    public string MSG { get; set; }
}
``` 

**Fields**
- `Error` (boolean value that determines if the request had an error or not)
- `MSG` (the message that is sent, success if no error happened during the request)

## JSON Representation
```json
{
    "error": bool,
    "msg": string
}
```

## Methods
```cs
public static APIStatusMsg SuccessMSG(string msg)
```
This is the function to quickly create a successful status message

#### Parameters
- `msg` (the message that will be in the API message) 

```cs
public static APIStatusMsg ErrorMSG(string msg)
```
This is the function to quickly create an error status message

#### Parameters
- `msg` (the message that will be in the error status message)
