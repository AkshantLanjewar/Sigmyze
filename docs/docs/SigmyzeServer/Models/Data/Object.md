# Object
Holds all the information for an object within a [dataset](./Dataset.md)

## Concept
The object is the second layer of seperation within the dataset schema.
This container is meant for groupings of indicators, such as countries,
stock exchanges etc.

## Implementation
```cs
public class DatasetCollection
{
    public string ObjectID { get; set; }
    
    public string ObjectFullname { get; set; }

    public string ObjectLogo { get; set; } 

    public List<DatasetIndicator> Indicators { get; set; }

    public List<string>? AddedObjects { get; set; }
}
```

## Members

### ObjectID (object_id)
`string`
> This is the id of the object (unique field)

### ObjectFullname (object_fullname)
`string`
> This is the fullname of the object

### ObjectLogo (object_logo)
`string`
> This is the logo for the object

### Indicators
`List<DatasetIndicator>`
> This is a list of [indicators](./Indicator.md) within the object

### AddedObjects
`List<string>?`
> This is a list of the [indicators](./Indicator.md) id's used primarliy for performance