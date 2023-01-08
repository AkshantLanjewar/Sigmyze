import { ITreeNode } from "../../tree/tree"

type deleteProject = (id: string, type: string) => void
type createProject = (parent_id: string, name: string, type: string) => void
type setActiveItem = (id: string, type: string) => void
type setExplorerModal = (id: string) => void

interface ILunarState {
    data?: ILunarProjectData | null,
    ui?: ILunarUIData | null,

    //functions
    deleteProject: deleteProject,
    createProject: createProject,
    setActiveItem: setActiveItem,
    setExplorerModal: setExplorerModal
}

//ui
interface ILunarUIData {
    active_id: string,
    active_type: string,
    explorer_modal: string | null | undefined
}

//data
interface ILunarProjectData {
    project_id: string,
    project_name: string,

    splits: Array<IProjectNode>,
    nodes?: Array<ITreeNode>
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

}

//functions

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
                    children: []
                } as IProjectNode
            ]
        } as IProjectNode
    ]
} as ILunarProjectData

export { DEFAULT_PROJECT }
export type { 
    ILunarState,
    ILunarProjectData,
    ILunarUIData,
    IProjectNodeAction,
    IProjectNode,
    deleteProject,
    createProject,
    setExplorerModal 
}