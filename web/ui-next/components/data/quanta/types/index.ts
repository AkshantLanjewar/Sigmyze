import { INodeExecutionResult } from "../../../quanta/quanta-editor/execution-engine/context/types"
import { IQuantaRFEdge, IQuantaRFNode, IQuantaStore, IQuantaTypeRef } from "../../../quanta/quanta-editor/types/types"
import { IQuantaSchema } from "../../../quanta/schema-editor/types"
import { IPipelineAnalysis, IPipelinedData } from "../../../quanta/selector-pane/context/types"
import { IQuantaEditorProject, IQuantaProjectData, IQuantaSelector, IQuantaSelectorCode } from "./project"
import { IQuantaTab } from "./ui"

interface IQuantaState {
    /**
     * This is the actual project data for the project.
     * This is the component that is stored on the server aswell.
     */
    project_data?: IQuantaProjectData,

    /**
     * This is the active tab state for the ui
     */
    tabId?: string,

    /**
     * Theese are the tabs for the viewport 
     */
    tabs?: IQuantaTab[],

    /**
     * this is the active selector_id for the selector view
     */
    activeSelectorId?: string | null,

    updateSchema: boolean,

    updateEditorSchema: boolean,

    updateEditorIndicators: boolean,

    quantaId: string | null,

    organizationId: string | null,

    editorProjects: IQuantaEditorProject[],

    selectors: IQuantaSelector[],

    selectorsUpdated: boolean,

    dataLoaded: boolean,

    //tells the application to update the indicators
    toggleUpdateEditorIndicators: () => void,

    //tab related functions
    changeTab: (tabId: string) => void,
    focusTab: (fileId: string, fileType: string) => void,
    closeTab: (tabId: string) => void,

    //text changing related functions
    changeText: (text: string, field: "title" | "id" | "desc") => void,

    //opens a context modal
    openModal: (modalId: string) => void

    //opens the specified selector in the selectors view
    openSelector: (selectorId: string) => void
    //activeates selector
    activateSelector: (selectorId: string) => void,

    //retreives a schema from the list
    getSchema: (parentId: string) => IQuantaSchema | undefined
    //edits a schema from the list
    changeSchema: (parentId: string, nSchema: IQuantaSchema) => void
    //inits the schema object within the context
    initSchema: (parentId: string) => void,
    //creates a new element within the schema
    createElement: (parentId: string, nodeId: string, fieldName?: string) => void,
    //edits an elements info
    editSchema: (
        parentId: string,
        nodeId: string, 
        type: "edit_text" | "edit_type", 
        text: string, 
        node_type: IQuantaTypeRef | undefined
    ) => void
    //deletes an element within the schema
    deleteElement: (parentId: string, nodeId: string) => void,
    //erases a schema from memory
    eraseSchema: (parentId: string) => void,

    unfocusAll: (parentId: string) => void,

    //this section handles the functions relating to quanta editor projects
    getEditorProject: (fileId: string) => IQuantaEditorProject | undefined,
    setEditorProject: (fileId: string, nodes: IQuantaRFNode[], edges: IQuantaRFEdge[], quantaStore: IQuantaStore, executionResults: INodeExecutionResult[]) => void,
    setEditorExecution: (fileId: string, executionResults: INodeExecutionResult[]) => void,

    //section handles the selectors
    newSelector: (selectorName: string, selectorId: string) => void,
    
    //adds source to the selector
    addSelectorSource: (selectorId: string, selectorSource: IQuantaSelectorCode) => void,

    //adds analysis to selector pipeline
    editSelectorAnalysis: (selectorId: string, analysis: IPipelineAnalysis[]) => void,

    //edits pipelined objects in selector 
    editPipelineObjects: (selectorId: string, data: IPipelinedData[]) => void,

    //edits pipeline links
    editPipelineLinks: (selectorId: string, links: {[key: string]: string}) => void,

    //deletes the schema
    deleteSelector: (selectorId: string) => void
}

export type { IQuantaState }