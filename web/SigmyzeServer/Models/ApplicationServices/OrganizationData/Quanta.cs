using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace SigmyzeServer.Models.ApplicationServices;

public class QuantaProjectCacheId
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [Newtonsoft.Json.JsonIgnore]
    public string? Id { get; set; }

    [BsonElement("organizationId")]
    [JsonProperty("organizationId")]
    [JsonPropertyName("organizationId")]
    public string? OrganizationId { get; set; }

    [BsonElement("projectId")]
    [JsonProperty("projectId")]
    [JsonPropertyName("projectId")]
    public string? ProjectId { get; set; }

    [BsonElement("processId")]
    [JsonProperty("processId")]
    [JsonPropertyName("processId")]
    public string? ProcessId { get; set; }
}

public class QuantaRepositoryDefinition
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    [Newtonsoft.Json.JsonIgnore]
    public string? Id { get; set; }

    [BsonElement("project_id")]
    [JsonProperty("project_id")]
    [JsonPropertyName("project_id")]
    public string? ProjectId { get; set; }

    [BsonElement("project_name")]
    [JsonProperty("project_name")]
    [JsonPropertyName("project_name")]
    public string? ProjectName { get; set; }

    //NOTE: This field is used for user authentication, the backend has to verify whether or not 
    //the requested user can actually acesss this project
    [BsonElement("organization_id")]
    [Newtonsoft.Json.JsonIgnore]
    public string? OrganizationId { get; set; }

    [BsonElement("project_indicators")]
    [Newtonsoft.Json.JsonIgnore]
    public List<QuantaIndicator>? ProjectIndicators { get; set; }

    [BsonElement("project_data")]
    [JsonProperty("project_data")]
    [JsonPropertyName("project_data")]
    public QuantaProjectData? ProjectData { get; set; }
}

public class QuantaProjectData
{
    [BsonElement("dataset_name")]
    [JsonProperty("dataset_name")]
    [JsonPropertyName("dataset_name")]
    public string? DatasetName { get; set; }

    [BsonElement("dataset_id")]
    [JsonProperty("dataset_id")]
    [JsonPropertyName("dataset_id")]
    public string? DatasetId { get; set; }

    [BsonElement("dataset_description")]
    [JsonProperty("dataset_description")]
    [JsonPropertyName("dataset_description")]
    public string? DatasetDescription { get; set; }

    [BsonElement("files")]
    [JsonProperty("files")]
    [JsonPropertyName("files")]
    public List<QuantaFile>? Files { get; set; }

    [BsonElement("store")]
    [JsonProperty("store")]
    [JsonPropertyName("store")]
    public QuantaDataStore? Store { get; set; }

    [BsonElement("dataset_schema")]
    [JsonProperty("dataset_schema")]
    [JsonPropertyName("dataset_schema")]
    public List<QuantaSchemas>? DatasetSchema { get; set; }    
}

public class QuantaFile
{
    [BsonElement("name")]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [BsonElement("type")]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [BsonElement("id")]
    [JsonProperty("id")]
    [JsonPropertyName("id")]
    public string? Id { get; set; }
}

public class QuantaDataStore
{
    [BsonElement("selectors")]
    [JsonProperty("selectors")]
    [JsonPropertyName("selectors")]
    public List<QuantaSelector>? Selectors { get; set; }

    [BsonElement("editorProjects")]
    [JsonProperty("editorProjects")]
    [JsonPropertyName("editorProjects")]
    public List<QuantaEditorProject>? EditorProjects { get; set; }
}

public class QuantaSelector
{
    [BsonElement("selectorId")]
    [JsonProperty("selectorId")]
    [JsonPropertyName("selectorId")]
    public string? SelectorId { get; set; }

    [BsonElement("selectorName")]
    [JsonProperty("selectorName")]
    [JsonPropertyName("selectorName")]
    public string? SelectorName { get; set; }

    [BsonElement("selectorDescription")]
    [JsonProperty("selectorDescription")]
    [JsonPropertyName("selectorDescription")]
    public string? selectorDescription { get; set; }
}

public class QuantaSchemas
{
    [BsonElement("schemaId")]
    [JsonProperty("schemaId")]
    [JsonPropertyName("schemaId")]
    public string? SchemaId { get; set; }

    [BsonElement("schema")]
    [JsonProperty("schema")]
    [JsonPropertyName("schema")]
    public QuantaSchema? Schema { get; set; }
}