## Introduction
This file contains all the models related to the node editor within the quanta editor.

## QuantaEditorProject
This is the model that encapsulates all the data needed to reconstructe a node editor view within the sigmyze platform.

### Definition
```cs
public class QuantaEditorProject
{
    public string? FileId { get; set; }
    public List<QuantaRFNode>? Nodes { get; set; }
    public List<QuantaRFEdge>? Edges { get; set; }
    public Dictionary<string, QuantaStore>? QuantaStore { get; set; }
    public List<ExecutionResult>? ExecutionResults { get; set; }
}
```

**Fields**
- `FileId` (this is the id for the node editor file, used to query it)
- `Nodes` (these are the [nodes](#quantarfnode) present within the editor)
- `Edges` (these are the [connections](#quantarfedge) between nodes present within the editor)
- `QuantaStore` (this [stores](#quantastore) abitrary values in the editor for dynamic nodes)
- `ExecutionResults` (this stores any [execution results](#executionresult) that can update the configuration of a node)

## QuantaRFNode
This is the model that defines a node within the quanta editor.

### Definition
```cs
public class QuantaRFNode
{
    public string? Id { get; set; }
    public string? Type { get; set; }
    public QuantaXYPos? Position { get; set; }
    public QuantaRFNodeData? Data { get; set; }
    public string? ParentNode { get; set; }
    public string? Extent { get; set; }
    public QuantaRFNodeStyles? Style { get; set; }
    public bool? ExpandParent { get; set; }
}
```

**Fields**
- `Id` (the id of the node, assigned on creation)
- `Type` (the react flow editor type of the node)
- `Position` (the [xy position](#quantaxypos) of the node within the editor's canvas)
- `Data` (the custom [data](#quantarfnodedata) needed for the editor to render the node correctly)
- `ParentNode` (if this node has a parent, this is the id of that node)
- `Extent` (this is the extent a node can go if it has a parent)
- `Style` (these are the custom [styles](#quantarfnodestyles) applied to this node)
- `ExpandParent` (whether or not this node should expand the size of its parent when dragged outside the parent's bounds)

## QuantaRFNodeStyles
This model defines the styles a node can have within the react flow editor

### Definition
```cs
public class QuantaRFNodeStyles
{
    public float? Width { get; set; }
    public float? Height { get; set; }
}
```

**Fields**
- `Width` (the width of the node in px)
- `Height` (the height of the node in px)

## QuantaRFNodeData
This is the model that holds all of the custom data needed to correctly render a node within the editor

### Definition
```cs
public class QuantaRFNodeData
{
    public string? InstructionId { get; set; }
    public string? NodeId { get; set; }
    public List<QuantaRFNodeDataType>? Types { get; set; }
}
```

**Fields**
- `InstructionId` (this is the id for the type of node that needs to be rendered by the custom node component)
- `NodeId` (the quanta assigned node id for the node)
- `Types` (custom [types](#quantarfnodedatatype) for a socket)

## QuantaRFNodeDataType
This is the object that holds a custom data type used by a node's socket for a node

### Definition
```cs
public class QuantaRFNodeDataType
{
    public string? SocketId { get; set; }
    public QuantaType? Type { get; set; }
}
```

**Fields**
- `SocketId` (the id of the socket this type is used for)
- `Type` (the custom type used)

## QuantaXYPos
This is the XY position used in the quanta node editor

### Definition
```cs
public class QuantaXYPos
{
    public float? X { get; set; }
    public float? Y { get; set; }
}
```

**Fields**
- `X` (how far away horizontally the node is from the origin in px)
- `Y` (how far away vertically the node is from the origin in px)

## QuantaRFEdge
This is the definition for an edge within the quanta node editor

### Definition
```cs
public class QuantaRFEdge
{
    public string? Id { get; set; }
    public string? Type { get; set; }
    public string? Source { get; set; }
    public string? SourceHandle { get; set; }
    public string? Target { get; set; }
    public string? TargetHandle { get; set; }
    public QuantaStyles? Style { get; set; }
}
```

**Fields**
- `Id` (the id of the edge within the rf editor)
- `Type` (the type of edge, due to custom edge usage)
- `Source` (the id of the source node)
- `SourceHandle` (the id of the socket from the source handle)
- `Target` (the id of the target node)
- `TargetHandle` (the id of the target node's socket)
- `Style` (custom [styles](#quantastyles) applied to the edge)

## QuantaStyles
This model contains the definition for the custom styles applied to a react flow edge within the editor.

### Definition
```cs
public class QuantaStyles
{
    public string? Stroke { get; set; }
    public int? StrokeWidth { get; set; }
}
```

## QuantaStore
This is the definition for the object that stores dynamic data for nodes to leverage 

### Definition
```cs
public class QuantaStore
{
    public string? Name { get; set; }
    public string? FormTitle { get; set; }
    public List<QuantaStoreItem>? Items { get; set; }
}
```

**Fields**
- `Name` (the name for the store)
- `FormTitle` (the title for the form that adds items to the store)
- `Items` (the items that are stored within the quanta store)

## QuantaStoreItem
This is the definition for an object that is stored within a quanta store

### Definition
```cs
public class QuantaStoreItem
{
    public string? Id { get; set; }
    public string? FrozenData { get; set; }
    public List<string>? AddedKeys { get; set; }
}
```

**Fields**
- `Id` (the id of the item stored)
- `FrozenData` (the stringified version of the obejct that is being stored)
- `AddedKeys` (the keys that should be present in the frozen data once parsed)

## ExecutionResult
This is the data results from a local execution carried out on the editor contents

### Definition
```cs
public class ExecutionResult
{
    public string? NodeId { get; set; }
    public string? FieldId { get; set; }
    public string? RawData { get; set; }
    public List<QuantaSocket>? ComputedSockets { get; set; }
}
```

**Fields**
- `NodeId` (this is the id of the node whose results were sent back)
- `FieldId` (the id of the field, used to apply calculations to node)
- `RawData` (the stringifed version of the data returned from the server)
- `ComputedSockets` (the [dynamic sockets](#quantasocket) for the node that were computed from the data)

## QuantaSocket
This is the definition for a custom socket within the quanta node editor

### Definition
```cs
public class QuantaSocket
{
    public QuantaType? Type { get; set; }
    public string? SocketId { get; set; }
    public string? SocketName { get; set; }
    public bool? HideType { get; set; }
    public bool? SelectableType { get; set; }
    public bool? StaticSocket { get; set; }
    public bool? DynamicSocket { get; set; }
    public bool? DynamicSocketTag { get; set; }
    public string? GroupTitle { get; set; }
    public string? GroupId { get; set; }
    public string? DynamicDepend { get; set; }
    public string? QuantaDepend { get; set; }
    public string? StoreKey { get; set; }
    public string? InputId { get; set; }
    public List<QuantaDependentSocket>? DependentInputs { get; set; }
    public bool? IsArray { get; set; }
    public QuantaType? ArrayType { get; set; }
    public string? ExecutionField { get; set; }
    public bool? IsDatasetField { get; set; }
}
```

**Fields**
- `Type` (the output type for the socket)
- `SocketId` (the id for the socket, defined in config files based on node)
- `SocketName` (name for the socket, defined in config files based on the node being rendered)
- `HideType` (whether or not this socket should display its type)
- `SelectableType` (whether or not this socket's type can be changed)
- `StaticSocket` (whether or not this socket has an output or not)
- `DynamicSocket` (whether or not the socket changes on connection)
- `DynamicSocketTag`
- `GroupTitle` (if this is a socket group, the title for the group)
- `GroupId` (the id for the socket group)
- `DynamicDepend` (whether or not this socket depends on another socket's value)
- `QuantaDepend` (whether or not this socket depends on [execution results](#executionresult))
- `StoreKey` (whether or not this socket depends on a value in the [quanta store](#quantastore))
- `InputId`
- `DependentInputs` (the [inputs](#quantadependentsocket) that get rendered on a dynamic depend condition being fulfilled)
- `IsArray` (whether or not the socket outputs an array)
- `ArrayType` (the type for the array)
- `ExecutionField` (the field in the execution results the dynamic socket depends on)
- `IsDatasetField` (whether or not this socket is referring to a dataset field value)

## QuantaDependentSocket
This is the definition for the sockets that get rendered on a dynamic condition being fulfilled

### Definition
```cs
public class QuantaDependentSocket
{
    public string? InputValue { get; set; }
    public List<QuantaSocket>? Sockets { get; set; }
}
```

**Fields**
- `InputValue` (the value that fulfills the condition)
- `Sockets` (the sockets that got rendered)