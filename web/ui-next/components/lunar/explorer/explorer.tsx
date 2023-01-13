import { useState, useEffect, useContext } from 'react'
import styles from './explorer.module.scss'
import { LunarContextData } from '../../data/lunar/context/context'
import { ILunarState } from '../../data/lunar/types'
import { ConvertToTree } from '../../data/lunar/utils'

import Tree, { ITreeNode } from '../../tree/tree'

const Explorer: React.FC = ({ }) => {
    const [nodes, setNodes] = useState<Array<ITreeNode>>([])
    const { 
        data,
        ui,
        deleteProject,
        createProject,
        setActiveItem,
        setExplorerModal,
        deleteIndicator 
    } = useContext(LunarContextData) as ILunarState 

    function SetActive(oNodes: Array<ITreeNode>, id: string) {
        let nNodes = []
        if(oNodes === undefined)
            return []

        for(let i = 0; i < oNodes.length; i++) {
            let node   = oNodes[i]
            node.active = false
            if(node.node_id === id) {
                node.active = true
            }

            node.children = SetActive(node.children, id)
            nNodes.push(node)
        }

        return nNodes
    }

    function SetActiveWrapper(id: string, type: string) {
        setActiveItem(id, type)
        let nNodes = SetActive(nodes, id)       
        setNodes([ ...nNodes ])
    }

    useEffect(() => {
        if(data == null)
            return
        if(ui == null)
            return

        let nNodes = ConvertToTree(data.splits, { deleteProject, createProject, setExplorerModal, deleteIndicator }) 
        if(nNodes === undefined)
            return
        //set the active from the ui
        nNodes = SetActive(nNodes, ui.visual_id)

        setNodes([ ...nNodes ]) 
    }, [data, ui])

    return (
        <div className={styles['scroll-wrapper']}>
            <div className={styles.content}>
                <Tree 
                    nodes={nodes} 
                    setActive={SetActiveWrapper}
                />
            </div>
        </div>
    )
}

export default Explorer