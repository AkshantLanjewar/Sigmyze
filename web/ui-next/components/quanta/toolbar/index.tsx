import { useCallback, useContext, useEffect, useState } from "react"
import { ITreeNode } from "../../tree/tree"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import { QuantaUIContextData } from "../../data/quanta/ui-context"
import { IQuantaUIState } from "../../data/quanta/ui-context/state"
import { v4 } from "uuid"
import QToolbarView from "./view"

const QToolbar: React.FC = ({ }) => {
    const [nodes, setNodes] = useState<Array<ITreeNode>>([])
    const [displayNodes, setDisplayNodes] = useState<ITreeNode[]>([])

    const { project_data } = useContext(QuantaContextData) as IQuantaState
    const { tabId, focusTab, tabs } = useContext(QuantaUIContextData) as IQuantaUIState

    const buildToolbar = useCallback(() => {
        let datasetName = project_data?.dataset_name
        let quantaFiles = project_data?.files
        if(datasetName === undefined || quantaFiles === undefined)
            return

        let nNodes = [] as ITreeNode[]
        nNodes.push({
            node_id: v4(),
            node_title: datasetName,
            node_type: "dataset",
            children: [],
            opened: true
        })

        for(let i = 0; i < quantaFiles.length; i++) {
            let file = quantaFiles[i]
            if(file.type === "code::selector")
                continue

            let node = {
                node_id: file.id,
                node_title: file.name,
                node_type: file.type,
                children: [],
            } as ITreeNode

            nNodes[0].children.push(node)
        }

        setNodes([ ...nNodes ])
    }, [project_data])

    const deactivateNodes = useCallback((_nodes: ITreeNode[]) => {
        let nNodes = [] as ITreeNode[]
        for(let i = 0; i < _nodes.length; i++) {
            let node = _nodes[i]
            node.active = false
            node.children = deactivateNodes(node.children)

            nNodes.push(node)
        }

        return nNodes
    }, [])

    //function that sets a file to be active within the sidebar, highlighting it
    const setActive = useCallback((id: string, type: string) => {
        let nTreeNodes = displayNodes
        nTreeNodes = deactivateNodes(nTreeNodes)
        if(type === "dataset")
            nTreeNodes[0].active = true

        for(let i = 0; i < nTreeNodes[0].children.length; i++) {
            let node = nTreeNodes[i]
            if(node.node_id === id) {
                focusTab(id, type)
                node.active = true
            }

            nTreeNodes[0].children[i] = node
        }

        setDisplayNodes([ ...nTreeNodes ])
    }, [displayNodes])

    //effects for the toolbar
    useEffect(() => {
        buildToolbar()
    }, [])

    useEffect(() => {
        buildToolbar()
    }, [project_data])

    useEffect(() => {
        if(nodes.length === 0)
            return

        let nodeChildren = [ ...nodes[0].children ]
        let nDisplayNodes = [ ...nodes ]
        nDisplayNodes[0].children = nodeChildren

        setDisplayNodes([ ...nDisplayNodes ])
    }, [nodes])

    useEffect(() => {
        if(tabs === undefined)
            return
        if(tabId === undefined) {
            let nNodes = deactivateNodes(nodes)
            setNodes([ ...nNodes ])

            return
        }

        let tab = undefined
        for(let i = 0; i < tabs.length; i++) {
            let tab_ = tabs[i]
            if(tab_.tabId === tabId)
                tab = tab_
        }

        if(tab === undefined)
            return

        setActive(tab.connected_file!, tab.tabType!)
    }, [tabId])

    return <QToolbarView displayNodes={displayNodes} setActive={setActive} />
}

export default QToolbar