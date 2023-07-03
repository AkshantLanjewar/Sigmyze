import { INodeExecutionResult } from "../../../quanta/quanta-editor/execution-engine/context/types"
import { IQuantaRFEdge, IQuantaRFNode, IQuantaStore } from "../../../ui/einstein/types/types"
import { IQuantaSchema } from "../../../quanta/schema-editor/types"
import { IPipelineAnalysis, IPipelinedData } from "../../../quanta/selector-pane/context/types"
import { ISchemaItem } from "../../../quanta/selector-pane/selector-frame-tester/types"

interface IQuantaProjectData {
    /**
     * This is the name of the dataset
     */
    dataset_name?: string,

    /**
     * This is the id for the dataset
     */
    dataset_id?: string,

    /**
     * this is the description for the dataset
     */
    dataset_description?: string,

    /**
     * Different file components in the dataset
     */
    files?: IQuantaFile[],

    /**
     * Store where all the data and configs are stored
     */
    store?: IQuantaDataStore,

    /**
     * this is the schema for the dataset
     */
    dataset_schema?: ProjectSchemas[]

    //the fields below are used for server purposes only

    /**
     * this is the schemas stored by the quanta context
     */
    schemas?: ProjectSchemas[],
}

interface IQuantaFile {
    name?: string,
    type?: string,
    id?: string
}

interface IQuantaDataStore {
    selectors: IQuantaSelector[],
    editorProjects?: IQuantaEditorProject[],
    categorization?: IQuantaCategorization,
    textStore?: IQuantaTextStore
}

interface IQuantaTextStore {
    [key: string]: string
}

interface IQuantaCategorization {
    fileName?: string,
    mapsTo?: string, // this is the field that the category maps to in the dataset
    categories?: string[], // this is the actual list of categories that are extracted
    categoriesMap?: { [key: string]: string[] } //
}

interface ProjectSchemas {
    schemaId: string,
    schema: IQuantaSchema
}

interface IQuantaSelector {
    selectorId?: string,
    selectorName?: string,
    selectorDescription?: string,
    selectorCode?: IQuantaSelectorCode,
    selectorPipeline?: ISelectorPipeline
}

interface ISelectorPipeline {
    pipelinedObjects?: IPipelinedData[],
    pipelineAnalysis?: IPipelineAnalysis[],
    pipelineLinks?: {[key: string]: string}
}

interface IQuantaSelectorCode {
    containerId: string,
    schemaId: string,
    schemaName: string,
    schemaItems: ISchemaItem[],
    sourceCode: string,
    selectorLinks?: ISelectorLinks,
    defaultValue: string
}

interface ISelectorLinks {
    [key: string]: string //key is the id of the object in the dataset schema, value is the id in the selector schema
}

interface IQuantaEditorProject {
    fileId: string,
    nodes: IQuantaRFNode[],
    edges: IQuantaRFEdge[],
    quantaStore: IQuantaStore,
    executionResults: INodeExecutionResult[]
}

export type { 
    IQuantaProjectData,
    IQuantaFile,
    IQuantaDataStore,
    IQuantaSelector,
    ProjectSchemas,
    IQuantaEditorProject,
    IQuantaSelectorCode,
    ISelectorLinks,
    ISelectorPipeline,
    IQuantaCategorization,
    IQuantaTextStore 
}