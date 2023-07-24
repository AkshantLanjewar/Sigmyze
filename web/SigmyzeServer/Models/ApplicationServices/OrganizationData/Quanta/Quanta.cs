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

    [BsonElement("project_data")]
    [JsonProperty("project_data")]
    [JsonPropertyName("project_data")]
    public QuantaProjectData? ProjectData { get; set; }

    public bool Validate()
    {
        if(this.ProjectData == null || this.ProjectData.DatasetName == null || this.ProjectData.DatasetId == null)
            return false;
        if(this.ProjectData.DatasetDescription == null || this.ProjectData.Store == null)
            return false;
        if(this.ProjectData.Store.Selectors == null || this.ProjectData.Store.TextStore == null || this.ProjectData.Store.Categorization == null)
            return false;

        return true;
    }
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

    [BsonElement("categorization")]
    [JsonProperty("categorization")]
    [JsonPropertyName("categorization")]
    public QuantaCategorization? Categorization { get; set; }

    [BsonElement("textStore")]
    [JsonProperty("textStore")]
    [JsonPropertyName("textStore")]
    public Dictionary<string, string>? TextStore { get; set; }
}

public class QuantaCategorization
{
    [BsonElement("fileName")]
    [JsonProperty("fileName")]
    [JsonPropertyName("fileName")]
    public string? FileName { get; set; }

    [BsonElement("mapsTo")]
    [JsonProperty("mapsTo")]
    [JsonPropertyName("mapsTo")]
    public string? MapsTo { get; set; }

    [BsonElement("categories")]
    [JsonProperty("categories")]
    [JsonPropertyName("categories")]
    public List<string>? Categories { get; set; }

    [BsonElement("categoriesMap")]
    [JsonProperty("categoriesMap")]
    [JsonPropertyName("categoriesMap")]
    public Dictionary<string, List<string>>? CategoriesMap { get; set; }
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
    public string? SelectorDescription { get; set; }

    [BsonElement("selectorCode")]
    [JsonProperty("selectorCode")]
    [JsonPropertyName("selectorCode")]
    public QuantaSelectorCode? SelectorCode { get; set; }

    [BsonElement("selectorPipeline")]
    [JsonProperty("selectorPipeline")]
    [JsonPropertyName("selectorPipeline")]
    public QuantaSelectorPipeline? SelectorPipeline { get; set; }
}

public class QuantaSelectorPipeline
{
    [BsonElement("pipelinedObjects")]
    [JsonProperty("pipelinedObjects")]
    [JsonPropertyName("pipelinedObjects")]
    public List<QuantaPipelinedObjects>? PipelinedObjects { get; set; }

    [BsonElement("pipelineAnalysis")]
    [JsonProperty("pipelineAnalysis")]
    [JsonPropertyName("pipelineAnalysis")]
    public List<QuantaPipelineAnalysis>? PipelineAnalyses { get; set; }

    [BsonElement("pipelineLinks")]
    [JsonProperty("pipelineLinks")]
    [JsonPropertyName("pipelineLinks")]
    public Dictionary<string, string>? PipelineLinks { get; set; }
}

public class QuantaPipelinedObjects
{
    [BsonElement("pipeline_id")]
    [JsonProperty("pipeline_id")]
    [JsonPropertyName("pipeline_id")]
    public string? PipelineId { get; set; }

    [BsonElement("pipeline_type")]
    [JsonProperty("pipeline_type")]
    [JsonPropertyName("pipeline_type")]
    public string? PipelineType { get; set; }

    [BsonElement("pipeline_name")]
    [JsonProperty("pipeline_name")]
    [JsonPropertyName("pipeline_name")]
    public string? PipelineName { get; set; }

    [BsonElement("dataset_id")]
    [JsonProperty("dataset_id")]
    [JsonPropertyName("dataset_id")]
    public string? DatasetId { get; set; }

    [BsonElement("reservable")]
    [JsonProperty("reservable")]
    [JsonPropertyName("reservable")]
    public bool? Reservable { get; set; }
}

public class QuantaPipelineAnalysis
{
    [BsonElement("objectId")]
    [JsonProperty("objectId")]
    [JsonPropertyName("objectId")]
    public string? ObjectId { get; set; }

    [BsonElement("objectType")]
    [JsonProperty("objectType")]
    [JsonPropertyName("objectType")]
    public string? ObjectType { get; set; }

    [BsonElement("isArray")]
    [JsonProperty("isArray")]
    [JsonPropertyName("isArray")]
    public bool? IsArray { get; set; }

    [BsonElement("stringValue")]
    [JsonProperty("stringValue")]
    [JsonPropertyName("stringValue")]
    public string? StringValue { get; set; }

    [BsonElement("stringArray")]
    [JsonProperty("stringArray")]
    [JsonPropertyName("stringArray")]
    public List<string>? StringArray { get; set; }

    [BsonElement("dateValue")]
    [JsonProperty("dateValue")]
    [JsonPropertyName("dateValue")]
    public int? DateValue { get; set; }

    [BsonElement("dateArray")]
    [JsonProperty("dateArray")]
    [JsonPropertyName("dateArray")]
    public List<int>? DateArray { get; set; }
}

public class QuantaSelectorCode
{
    [BsonElement("containerId")]
    [JsonProperty("containerId")]
    [JsonPropertyName("containerId")]
    public string? ContainerId { get; set; }

    [BsonElement("schemaId")]
    [JsonProperty("schemaId")]
    [JsonPropertyName("schemaId")]
    public string? SchemaId { get; set; }

    [BsonElement("schemaName")]
    [JsonProperty("schemaName")]
    [JsonPropertyName("schemaName")]
    public string? SchemaName { get; set; }

    [BsonElement("sourceCode")]
    [JsonProperty("sourceCode")]
    [JsonPropertyName("sourceCode")]
    public string? SourceCode { get; set; }

    [BsonElement("selectorLinks")]
    [JsonProperty("selectorLinks")]
    [JsonPropertyName("selectorLinks")]
    public Dictionary<string, string>? SelectorLinks { get; set; }

    [BsonElement("schemaItems")]
    [JsonProperty("schemaItems")]
    [JsonPropertyName("schemaItems")]
    public List<QuantaSchemaItem>? SchemaItems { get; set; }

    [BsonElement("defaultValue")]
    [JsonProperty("defaultValue")]
    [JsonPropertyName("defaultValue")]
    public string? DefaultValue { get; set; }
}

public class QuantaSchemaItem
{
    [BsonElement("name")]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [BsonElement("type")]
    [JsonProperty("type")]
    [JsonPropertyName("type")]
    public string? Type { get; set; }
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