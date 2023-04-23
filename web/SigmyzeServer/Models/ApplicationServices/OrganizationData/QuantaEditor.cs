using System.Text.Json.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices;

public class QuantaEditorProject 
{
    [BsonElement("fileId")]
    [JsonProperty("fileId")]
    [JsonPropertyName("fileId")]
    public string? FileId { get; set; }

    [BsonElement("nodes")]
    [JsonProperty("nodes")]
    [JsonPropertyName("nodes")]
    public List<QuantaRFNode>? Nodes { get; set; }

    [BsonElement("edges")]
    [JsonProperty("edges")]
    [JsonPropertyName("edges")]
    public List<QuantaRFEdge>? Edges { get; set; }

    [BsonElement("quantaStore")]
    [JsonProperty("quantaStore")]
    [JsonPropertyName("quantaStore")]
    public Dictionary<string, QuantaStore>? QuantaStore { get; set; }

    [BsonElement("executionResults")]
    [JsonProperty("executionResults")]
    [JsonPropertyName("executionResults")]
    public List<ExecutionResult>? ExecutionResults { get; set; }
}

public class QuantaRFNode
{
    [BsonElement("id")]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [BsonElement("type")]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [BsonElement("position")]
    [JsonProperty("position")]
    [JsonPropertyName("position")]
    public QuantaXYPos? Position { get; set; }

    [BsonElement("data")]
    [JsonProperty("data")]
    [JsonPropertyName("data")]
    public QuantaRFNodeData? Data { get; set; }

    [BsonElement("parentNode")]
    [JsonProperty("parentNode")]
    [JsonPropertyName("parentNode")]
    public string? ParentNode { get; set; }

    [BsonElement("extent")]
    [JsonProperty("extent")]
    [JsonPropertyName("extent")]
    public string? Extent { get; set; }

    [BsonElement("style")]
    [JsonProperty("style")]
    [JsonPropertyName("style")]
    public QuantaRFNodeStyles? Style { get; set; }

    [BsonElement("expandParent")]
    [JsonProperty("expandParent")]
    [JsonPropertyName("expandParent")]
    public bool? ExpandParent { get; set; }
}

public class QuantaRFNodeStyles
{
    [BsonElement("width")]
    [JsonProperty("width")]
    [JsonPropertyName("width")]
    public float? Width { get; set; }

    [BsonElement("height")]
    [JsonProperty("height")]
    [JsonPropertyName("height")]
    public float? Height { get; set; }
}

public class QuantaRFNodeData
{
    [BsonElement("instructionId")]
    [JsonProperty("instructionId")]
    [JsonPropertyName("instructionId")]
    public string? InstructionId { get; set; }

    [BsonElement("nodeId")]
    [JsonProperty("nodeId")]
    [JsonPropertyName("nodeId")]
    public string? NodeId { get; set; }

    [BsonElement("types")]
    [JsonProperty("types")]
    [JsonPropertyName("types")]
    public List<QuantaRFNodeDataType>? Types { get; set; }
}

public class QuantaRFNodeDataType
{
    [BsonElement("socketId")]
    [JsonProperty("socketId")]
    [JsonPropertyName("socketId")]
    public string? SocketId { get; set; }

    [BsonElement("type")]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public QuantaType? Type { get; set; }
}

public class QuantaXYPos
{
    [BsonElement("x")]
    [JsonProperty("x")]
    [JsonPropertyName("x")]
    public float? X { get; set; }

    [BsonElement("y")]
    [JsonProperty("y")]
    [JsonPropertyName("y")]
    public float? Y { get; set; }
}

public class QuantaRFEdge
{
    [BsonElement("id")]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [BsonElement("type")]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [BsonElement("source")]
    [JsonProperty("source")]
    [JsonPropertyName("source")]
    public string? Source { get; set; }

    [BsonElement("sourceHandle")]
    [JsonProperty("sourceHandle")]
    [JsonPropertyName("sourceHandle")]
    public string? SourceHandle { get; set; }

    [BsonElement("target")]
    [JsonProperty("target")]
    [JsonPropertyName("target")]
    public string? Target { get; set; }

    [BsonElement("targetHandle")]
    [JsonProperty("targetHandle")]
    [JsonPropertyName("targetHandle")]
    public string? TargetHandle { get; set; }

    [BsonElement("style")]
    [JsonProperty("style")]
    [JsonPropertyName("style")]
    public QuantaStyles? Style { get; set; }
}

public class QuantaStyles
{
    [BsonElement("stroke")]
    [JsonProperty("stroke")]
    [JsonPropertyName("stroke")]
    public string? Stroke { get; set; }

    [BsonElement("strokeWidth")]
    [JsonProperty("strokeWidth")]
    [JsonPropertyName("strokeWidth")]
    public int? StrokeWidth { get; set; }
}

public class QuantaStore 
{
    [BsonElement("name")]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [BsonElement("formTitle")]
    [JsonProperty("formTitle")]
    [JsonPropertyName("formTitle")]
    public string? FormTitle { get; set; }

    [BsonElement("items")]
    [JsonProperty("items")]
    [JsonPropertyName("items")]
    public List<QuantaStoreItem>? Items { get; set; }

}

public class QuantaStoreItem
{
    [BsonElement("id")]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [BsonElement("frozenData")]
    [JsonProperty("frozenData")]
    [JsonPropertyName("frozenData")]
    public string? FrozenData { get; set; }

    [BsonElement("addedKeys")]
    [JsonProperty("addedKeys")]
    [JsonPropertyName("addedKeys")]
    public List<string>? AddedKeys { get; set; }
}

public class ExecutionResult
{
    [BsonElement("nodeId")]
    [JsonProperty("nodeId")]
    [JsonPropertyName("nodeId")]
    public string? NodeId { get; set; }

    [BsonElement("fieldId")]
    [JsonProperty("fieldId")]
    [JsonPropertyName("fieldId")]
    public string? FieldId { get; set; }

    [BsonElement("rawData")]
    [JsonProperty("rawData")]
    [JsonPropertyName("rawData")]
    public string? RawData { get; set; }

    [BsonElement("computedSockets")]
    [JsonProperty("computedSockets")]
    [JsonPropertyName("computedSockets")]
    public List<QuantaSocket>? ComputedSockets { get; set; }
}

public class QuantaSocket
{
    [BsonElement("type")]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public QuantaType? Type { get; set; }

    [BsonElement("socketId")]
    [JsonProperty("socketId")]
    [JsonPropertyName("socketId")]
    public string? SocketId { get; set; }

    [BsonElement("socketName")]
    [JsonProperty("socketName")]
    [JsonPropertyName("socketName")]
    public string? SocketName { get; set; }

    [BsonElement("hideType")]
    [JsonProperty("hideType")]
    [JsonPropertyName("hideType")]
    public bool? HideType { get; set; }

    [BsonElement("selectableType")]
    [JsonProperty("selectableType")]
    [JsonPropertyName("selectableType")]
    public bool? SelectableType { get; set; }

    [BsonElement("staticSocket")]
    [JsonProperty("staticSocket")]
    [JsonPropertyName("staticSocket")]
    public bool? StaticSocket { get; set; }

    [BsonElement("dynamicSocket")]
    [JsonProperty("dynamicSocket")]
    [JsonPropertyName("dynamicSocket")]
    public bool? DynamicSocket { get; set; }

    [BsonElement("dynamicSocketTag")]
    [JsonProperty("dynamicSocketTag")]
    [JsonPropertyName("dynamicSocketTag")]
    public bool? DynamicSocketTag { get; set; }

    [BsonElement("groupTitle")]
    [JsonProperty("groupTitle")]
    [JsonPropertyName("groupTitle")]
    public string? GroupTitle { get; set; }

    [BsonElement("groupId")]
    [JsonProperty("groupId")]
    [JsonPropertyName("groupId")]
    public string? GroupId { get; set; }

    [BsonElement("dynamicDepend")]
    [JsonProperty("dynamicDepend")]
    [JsonPropertyName("dynamicDepend")]
    public string? DynamicDepend { get; set; }

    [BsonElement("quantaDepend")]
    [JsonProperty("quantaDepend")]
    [JsonPropertyName("quantaDepend")]
    public string? QuantaDepend { get; set; }

    [BsonElement("storeKey")]
    [JsonProperty("storeKey")]
    [JsonPropertyName("storeKey")]
    public string? StoreKey { get; set; }

    [BsonElement("inputId")]
    [JsonProperty("inputId")]
    [JsonPropertyName("inputId")]
    public string? InputId { get; set; }

    [BsonElement("dependentInputs")]
    [JsonProperty("dependentInputs")]
    [JsonPropertyName("dependentInputs")]
    public List<QuantaDependentSocket>? DependentInputs { get; set; }

    [BsonElement("isArray")]
    [JsonProperty("isArray")]
    [JsonPropertyName("isArray")]
    public bool? IsArray { get; set; }

    [BsonElement("arrayType")]
    [JsonProperty("arrayType")]
    [JsonPropertyName("arrayType")]
    public QuantaType? ArrayType { get; set; }

    [BsonElement("executionField")]
    [JsonProperty("executionField")]
    [JsonPropertyName("executionField")]
    public string? ExecutionField { get; set; }

    [BsonElement("isDatasetField")]
    [JsonProperty("isDatasetField")]
    [JsonPropertyName("isDatasetField")]
    public bool? IsDatasetField { get; set; }
}

public class QuantaDependentSocket
{
    [BsonElement("inputValue")]
    [JsonProperty("inputValue")]
    [JsonPropertyName("inputValue")]
    public string? InputValue { get; set; }

    [BsonElement("sockets")]
    [JsonProperty("sockets")]
    [JsonPropertyName("sockets")]
    public List<QuantaSocket>? Sockets { get; set; }
}
