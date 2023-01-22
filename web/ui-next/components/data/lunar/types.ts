import { ITreeNode } from "../../tree/tree"
import { IIndicator } from "../datasets/DatasetsTypes"
import { IChartSettings, IGlobalChartSettings, IIndicatorSetting } from "./chart-types"
import { IDocument } from "./document-types"

type deleteProject = (id: string, type: string) => void
type createProject = (parent_id: string, name: string, type: string) => void
type setActiveItem = (id: string, type: string) => void
type addIndicator = ( id: string, indicator: IIndicator ) => void
type idExists = ( id: string ) => boolean
type idVoid = (id: string ) => void
type idStringNull = (id: string) => string | null
type getIndicatorSetting = (id: string, indicator: IIndicator) => IIndicatorSetting | null

interface ILunarState {
    data?: ILunarProjectData | null,
    ui?: ILunarUIData | null,

    //functions
    deleteProject: deleteProject,
    createProject: createProject,
    setActiveItem: setActiveItem,
    setExplorerModal: idVoid,
    addIndicator: addIndicator,
    deleteIndicator: addIndicator
    idExists: idExists,
    changeTab: idVoid,
    createSettings: idVoid,
    getNodeIdTab: idStringNull,
    getIndicatorSetting: getIndicatorSetting,
    createIndicatorSetting: Function,
    createGlobals: Function,
    setChartTitle: Function,
    getNode: Function,
    setDataNodes: Function,
    setNode: Function,
    closeTab: idVoid
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
interface ILunarProjectData {
    project_id: string,
    project_name: string,

    splits: Array<IProjectNode>,
    nodes?: Array<ITreeNode>,
    documents?: IProjectDocument[]
}

interface IProjectDocument {
    document_id: string,
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
    document_id?: string
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
    ILunarTab,
    IProjectNode,
    IChartSettings,
    IGlobalChartSettings,
    IIndicatorSetting,
    deleteProject,
    createProject,
    idVoid,
    getIndicatorSetting,
    addIndicator 
}