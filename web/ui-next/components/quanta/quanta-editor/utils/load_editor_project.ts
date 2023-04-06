import { Dispatch, SetStateAction } from "react"
import { IQuantaEditorProject } from "../../../data/quanta/types/project"
import { IQuantaRFEdge, IQuantaRFNode, IQuantaStore } from "../types/types"
import { BuildNode } from "./build_node"

function LoadEditorProject(
    fileId: string, 
    fileName: string, 
    getEditorProject: (fileId: string) => IQuantaEditorProject | undefined,
    setEditorProject: (fileId: string, nodes: IQuantaRFNode[], edges: IQuantaRFEdge[], quantaStore: IQuantaStore) => void,
    setNodes: Dispatch<SetStateAction<IQuantaRFNode[]>>,
    setEdges: Dispatch<SetStateAction<IQuantaRFEdge[]>>,
    setQuantaStore: Dispatch<SetStateAction<IQuantaStore>>,
    setEditorType: Dispatch<SetStateAction<"create" | "update">>
) {
    let nameSplit = fileName.split(" ")
    let initWord = nameSplit[0].toLowerCase()

    let editor_type = "create"
    if(initWord === "update")
        editor_type = initWord

    let editorProject = getEditorProject(fileId)
    let updateEditor = false

    let nodes = editorProject?.nodes ? editorProject.nodes : [BuildNode("start")!]
    let edges = editorProject?.edges ? editorProject.edges : []
    let store = editorProject?.quantaStore ? editorProject.quantaStore : {}

    if(nodes.length === 0) {
        nodes.push(BuildNode("start")!)
        updateEditor = true
    }
    
    setNodes([ ...nodes ])
    setEdges([ ...edges ])
    setQuantaStore({ ...store })
    setEditorType(editor_type as any)
    if(editorProject === undefined || updateEditor === true)
        setEditorProject(fileId, nodes, edges, store)
}

export { LoadEditorProject }