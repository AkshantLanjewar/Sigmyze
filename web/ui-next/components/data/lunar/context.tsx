import { createContext, useState, useEffect } from "react"
import { 
    ILunarState, 
    ILunarProjectData, 
    IProjectNode,
    ILunarUIData 
} from "./types"

import { v4 as uuidv4 } from 'uuid'
import { DEFAULT_PROJECT } from "./types"
import { EnumerateNodes } from "./utils"

import ExplorerModal from "../../lunar/explorer-modals/explorer-modals"

interface ILunarContextProps {
    children?: JSX.Element | never[]
}

const LunarContextData = createContext<ILunarState | null>(null)

const LunarContext: React.FC<ILunarContextProps> = ({ children }) => {
    const [data, setData] = useState<ILunarProjectData | null>(null)
    const [ui, setUI]     = useState<ILunarUIData | null>(null)

    useEffect(() => {
        let default_project    = DEFAULT_PROJECT
        default_project.splits = EnumerateNodes(default_project.splits) 

        let defaultUi = {} as ILunarUIData
        defaultUi.active_id = default_project.splits[0].node_id
        defaultUi.active_type = default_project.splits[0].node_type
        defaultUi.explorer_modal = null

        setData({ ...default_project })
        setUI({ ...defaultUi })
    }, [])

    // handles deleting of a project from the context state
    // ex deleting a folder, chart, or document
    function DeleteProjectItem(splits: Array<IProjectNode>, id: string, type: string): IProjectNode[] {
        let nNodes = [] as IProjectNode[]

        for(let i = 0; i < splits.length; i++) {
            let split = splits[i]
            if(split.node_id === id)
                continue
            
            //go thru children
            let children   = split.children
            split.children = DeleteProjectItem(children, id, type)
            nNodes.push(split)
        }

        return nNodes
    }

    function DeleteProjectItemWrapper(id: string, type: string): void {
        if(data == null)
            return

        let project_splits = data.splits ? data!.splits : []
        project_splits     = DeleteProjectItem(project_splits, id, type)
        
        let nData = data
        nData.splits = project_splits
        setData({ ...nData })
    }

    //handles the creation of a new project item
    function CreateProjectItem(splits: Array<IProjectNode>, parent_id: string, node: IProjectNode): IProjectNode[] {
        let nNodes = [] as IProjectNode[]
        for(let i = 0; i < splits.length; i++) {
            let split = splits[i]
            if(split.node_id === parent_id)
                split.children.push(node)
            
            let children = split.children
            split.children = CreateProjectItem(children, parent_id, node)
            nNodes.push(split)
        }

        return nNodes
    }

    function CreateProjectItemWrapper(parent_id: string, name: string, type: string): void {
        if(data == null)
            return
        
        let nNode = {
            node_id: uuidv4(),
            node_name: name,
            node_type: type,

            children: [],
            actions: [],
            data: {}
        } as IProjectNode

        let nData = data
        nData.splits = CreateProjectItem(nData.splits, parent_id, nNode)
        setData({ ...nData })
    }

    //handles the ui state
    function SetActiveItem(id: string, type: string) {
        if(type === "chart" || type === "document")
            return

        let n_ui = ui as ILunarUIData
        n_ui!.active_id = id
        n_ui!.active_type = type 
        setUI({ ...n_ui })
    }

    function OpenModal(id: string) {
        let n_ui = ui as ILunarUIData
        n_ui.explorer_modal = id
        setUI({ ...n_ui })
    }

    function CloseModal() {
        let n_ui = ui as ILunarUIData
        n_ui.explorer_modal = undefined
        setUI({ ...n_ui })
    }

    useEffect(() => {
        //console.log(ui)
    }, [ui])

    return (
        <>
            <LunarContextData.Provider value={{ 
                data, 
                ui,
                deleteProject: DeleteProjectItemWrapper, 
                createProject: CreateProjectItemWrapper,
                setActiveItem: SetActiveItem,
                setExplorerModal: OpenModal 
            }}>
                <div style={{ width: "100%", height: "100%" }}>
                    {ui !== null && (
                        <ExplorerModal 
                            ui={ui}
                            modalState={ui.explorer_modal}
                            close={CloseModal}
                            createProject={CreateProjectItemWrapper}
                        />
                    )}

                    {children}
                </div>
            </LunarContextData.Provider>
        </>
    )
}

export { LunarContextData }
export default LunarContext