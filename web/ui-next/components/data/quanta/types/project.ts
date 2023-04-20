import { INodeExecutionResult } from "../../../quanta/quanta-editor/execution-engine/context/types"
import { IQuantaRFEdge, IQuantaRFNode, IQuantaStore } from "../../../quanta/quanta-editor/types/types"
import { IQuantaSchema } from "../../../quanta/schema-editor/types"
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
    schemas?: ProjectSchemas[]
}

interface IQuantaFile {
    name?: string,
    type?: string,
    id?: string
}

interface IQuantaDataStore {
    selectors: IQuantaSelector[],
    editorProjects?: IQuantaEditorProject[]
}

interface ProjectSchemas {
    schemaId: string,
    schema: IQuantaSchema
}

interface IQuantaSelector {
    selectorId?: string,
    selectorName?: string,
    selectorDescription?: string,
    selectorCode?: IQuantaSelectorCode
}

interface IQuantaSelectorCode {
    containerId: string,
    schemaId: string,
    schemaName: string,
    schemaItems: ISchemaItem[],
    sourceCode: string
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
    IQuantaSelectorCode 
}