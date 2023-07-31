import { ITreeNode } from "../../../tree/tree"
import { IQuantaIndicatorShell } from "../../../ui/quanta-dataset-manager/types"
import { IIndicator } from "../../datasets/DatasetsTypes"
import { IChartSettings, IGlobalChartSettings, IIndicatorSetting } from "./chart-types"
import { IDocument } from "./document-types"


type deleteProject = (id: string, type: string) => void
type createProject = (parent_id: string, name: string, type: string) => void
type setActiveItem = (id: string, type: string) => void
type addIndicator = ( id: string, indicator: IIndicator ) => void
type addQuantaIndicator = ( id: string, indicatorId: IQuantaIndicatorShell ) => void
type idExists = ( id: string ) => boolean
type idVoid = (id: string ) => void
type idStringNull = (id: string) => string | null
type getIndicatorSetting = (id: string, indicator: IIndicator) => IIndicatorSetting | null
type getQuantaIndicatorSetting = (id: string, indicator: IQuantaIndicatorShell) => IIndicatorSetting | null

/**
 * @interface
 * @description
 *  this is the interface of the object that holds the
 *  lunar context together.
 */
interface ILunarState {
    /**
     * @description
     *  this is the application data for the context
     */
    data?: ILunarProjectData | null,

    /**
     * @description
     *  this is the ui state for the context, not persisted
     */
    ui?: ILunarUIData | null,

    /**
     * @description
     *  this is the check to see whether or not data was loaded
     *  from the server or not
     */
    loaded: boolean,

    /**
     * @description
     *  this check whether this is loading a custom project or not.
     */
    custom: boolean,

    /**
     * @param {string} id
     *  this is the id of the item that needs to be deleted
     * @param {string} type
     *  this is the type of the item that needs to be deleted
     * @function
     * @description
     *  this function deletes an item from the project data. 
     */
    deleteProject: deleteProject,

    /**
     * @param {string} itemId 
     *  this is the itemId of the item that needs to be created.
     * @param {string} name
     *  this is the name of the item that is going to be created.
     * @param {string} type 
     *  this is the type of the item being created
     * @function
     * @description
     *  this is the function that creates an item within the project file system
     */
    createProject: createProject,

    /**
     * @param {string} id
     *  this is the id of the item that is going to be set active
     * @param {string} type 
     *  this is the type of the item that is going to be set active
     * @function
     * @description
     *  This function sets an item from the sidebar to active.
     *  If this is the split, or a folder, when an item is created using the button,
     *  it is created within the new active folder.
     */
    setActiveItem: setActiveItem,

    /**
     * @param {string} id
     *  the id of the explorer modal that needs to be opened
     * @function
     * @description
     *  opens the explorer modal, allowing the user to create
     *  an item based on what modal they selected
     */
    setExplorerModal: idVoid,

    /**
     * @param {string} id
     *  this is the id of the chart item within the project
     * @param {IIndicator} indicator
     *  this is the indicator that is going to be added to the project
     * @function
     * @description
     *  this adds an indicator to the chart, updating the 
     *  server if this is a project within a drive 
     */
    addIndicator: addIndicator,

    /**
     * @param {string} id
     *  this is the id of the chart item within the project
     * @param {IIndicator} indicator
     *  this is the indicator that is going to be removed from the project
     * @function
     * @description
     *  this removes an indicator from the chart
     */
    deleteIndicator: addIndicator,

    /**
     * adds an quanta indicator into the chart's context
     */
    addQuantaIndicator: addQuantaIndicator,

    /**
     * removes a quanta indicator from the charts context
     */
    deleteQuantaIndicator: addQuantaIndicator,

    /**
     * grabs the setting for a quanta indicator in the chart
     */
    getQuantaIndicatorSetting: getQuantaIndicatorSetting

    /**
     * @param {string} id
     *  id for the item to be validated
     * @function
     * @description
     *  this checks whether the id exists within the project filesystem.
     */
    idExists: idExists,

    /**
     * @param {string} id
     *  id of the tab to be switched to
     * @function
     * @description
     *  switches the the active tab to the specified id. Updates sidebar as well
     */
    changeTab: idVoid,

    /**
     * @param {string} id
     *  id of the chart object
     * @function
     * @description
     *  this creates the settings object for the specified chart
     */
    createSettings: idVoid,

    /**
     * @param {string} id
     *  id of the tab being referenced
     * @function
     * @description
     *  this gets the linked node id from the tab id
     */
    getNodeIdTab: idStringNull,

    /**
     * @param {string} id
     *  id of the chart being referenced
     * @param {IIndicator} indicator
     *  this is the indicator for which we want the setting
     * @function
     * @description
     *  this grabs the setting from the chart for a specific indicator
     */
    getIndicatorSetting: getIndicatorSetting,

    /**
     * @param {string} id
     *  id of the chart being referenced
     * @param {IIndicatorSetting} setting
     *  the setting for the indicator being created
     * @function
     * @description
     *  this creates an indicator setting for the specified chart
     */
    createIndicatorSetting: Function,

    

    /**
     * @param {string} id
     *  id of the chart being referenced
     * @function
     * @description
     *  this creates the chart globals for the chart
     */
    createGlobals: Function,

    /**
     * @param {string} id
     *  id of the chart being referenced
     * @param {string} name
     *  new name of the title
     * @function
     * @description
     *  this sets the title of the chart with the name parameter
     */
    setChartTitle: Function,

    /***
     * @param {string} id
     *  id of the requested node
     * @function
     * @description 
     *  retrieves the node from the project filesystem
     * @returns IProjectNode | null
     */
    getNode: Function,

    /**
     * @param {ITreeNode[]} nodes
     *  nodes to be set
     * @function
     * @description
     *  sets the itree nodes, ui function to update display
     */
    setDataNodes: Function,

    /**
     * @param {IProjectNode} node
     *  new node
     * @function
     * @description
     *  this sets the node in the project to the new node
     */
    setNode: Function,

    /**
     * @param {string} id
     *  this is the tab id 
     * @function
     * @description
     *  this closes the tab id
     */
    closeTab: idVoid,

    /**
     * @function
     * @description
     *  updates the server with the drive data
     * @returns void
     */
    toggleDriveUpdate: () => void,

    /**
     * @param documentId 
     *  This is the id of the document being requested
     * @function
     * @description
     *  This grabs the document from the nodes repository. 
     *  If it doesnt exist, it creates one.
     * @returns IProjectDocument | null
     */
    grabDocument: (documentId: string) => IProjectDocument | null,

    /**
     * @description
     *  this sets the data of a document within the project
     * @param documentId 
     *  This is the id of the document being requested
     * @param documentData 
     *  this is the new data for the document
     * @returns void
     */
    setDocument: (documentId: string, documentData: IDocument) => void
}

//ui
interface ILunarUIData {
    active_id: string,
    active_type: string,
    visual_id: string,
    visual_type: string,
    explorer_modal: string | null | undefined,

    tabs: ILunarTab[],
    activeTab: string | null
}

interface ILunarTab {
    linked_node_id: string,
    tab_type: "chart" | "document",
    tab_name: string
    tab_id: string
}

//data
/**
 * @interface
 * @description
 *  This is the data structure that contains all the project data.
 *  It emulates a filesystem, and holds central repositories so that data,
 *  can be easily accessed.
 */
interface ILunarProjectData {
    /**
     * @description
     *  this is the current id for the project. 
     *  if it is the demo project, id will be set to demo
     */
    project_id: string,

    /**
     * @description
     *  this is the name of the project
     */
    project_name: string,

    /**
     * @description
     *  this is the emulated filesystem for the project, containing nodes.
     *  each "split" can contain file related data, with the project_split
     *  holding all the project nodes such as charts, folders and documents
     */
    splits: Array<IProjectNode>,

    /**
     * @description
     *  this is the data structure used by the tree view component
     */
    nodes?: Array<ITreeNode>,

    /**
     * @type Array<IProjectDocument>
     * @description
     *  This is the list of documents within the project.
     *  documents within the splits contain references to this
     *  central suppository of documents, making editing them easier and more performant.
     */
    documents?: IProjectDocument[]
}

/**
 * @interface
 * @description
 *  this is the datastructure for a document within a project.
 */
interface IProjectDocument {
    /**
     * @description
     *  this is the document_id for the doucment. 
     *  used to retreive specific document from list.
     */
    document_id: string,

    /**
     * @description
     *  this is the actual data for the document
     */
    data: IDocument
}

interface IProjectNode {
    node_id: string,
    node_name: string,
    node_type: string,

    children: Array<IProjectNode>,
    actions?: Array<IProjectNodeAction>,
    data?: IProjectNodeData
}

interface IProjectNodeAction {
    name: string,
    icon: JSX.Element,
    cb: Function
}

interface IProjectNodeData {
    indicators?: Array<IIndicator>,
    chartSettings?: IChartSettings,
    chartGlobals?: IGlobalChartSettings,
    document_id?: string,
    quantaIndicators?: IQuantaIndicatorShell[]
}

//default project
const DEFAULT_PROJECT = {
    project_id: "demo",
    project_name: "Demo Project",
    splits: [
        {
            node_id: "project_split",
            node_name: "Project",
            node_type: "project",

            actions: [],
            children: [
                {
                    node_id: "demo-chart",
                    node_name: "Demo Chart",
                    node_type: "chart",

                    actions: [],
                    children: [],
                    data: {
                        indicators: []
                    }
                } as IProjectNode
            ]
        } as IProjectNode
    ]
} as ILunarProjectData

const DEFAULT_SETTINGS = {
    indicatorSettings: []
} as IChartSettings

const DEFAULT_CHART_GLOBALS = {
    chartTitle: "Cool Swaggy Title"
} as IGlobalChartSettings

export { 
    DEFAULT_PROJECT,
    DEFAULT_SETTINGS,
    DEFAULT_CHART_GLOBALS 
}
export type { 
    ILunarState,
    ILunarProjectData,
    ILunarUIData,
    IProjectNodeAction,
    IProjectNodeData,
    IProjectDocument,
    ILunarTab,
    IProjectNode,
    IChartSettings,
    IGlobalChartSettings,
    IIndicatorSetting,
    deleteProject,
    createProject,
    idVoid,
    getIndicatorSetting,
    addIndicator,
    addQuantaIndicator,
    getQuantaIndicatorSetting 
}