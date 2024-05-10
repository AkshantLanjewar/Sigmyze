## Introduction
This file contains all the models related to schemas within the quanta editor

## QuantaSchema
This is a schema node within the editor

### Definition
```cs
public class QuantaSchema
{
    public string? Name { get; set; }
    public string? Type { get; set; }
    public string? NodeId { get; set; }
    public bool? HasChildren { get; set; }
    public List<QuantaSchema>? Children { get; set; }
    public QuantaType? QuantaType { get; set; }
}
```

**Fields**
- `Name` (this is the name for the schema)
- `Type` (this is the schema type)
- `NodeId` (id of the schema node)
- `HasChildren` (whether or not the schema has children)
- `Children` (if the schema has children, these are those)
- `QuantaType` (the [quanta type](#quantatype) for the schema node)

## QuantaType 
This is a type within the quanta editor

### Definition
```cs
public class QuantaType
{
    public string? GroupId { get; set; }
    public string? TypeId { get; set; }
}
```

**Fields**
- `GroupId` (the type group the type belongs too)
- `TypeId` (the id of the type within the group)