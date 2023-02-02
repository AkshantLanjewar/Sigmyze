import { useState, useEffect, useContext } from 'react'
import styles from './explorer.module.scss'
import { LunarContextData } from '../../data/lunar/context'
import { ILunarState } from '../../data/lunar/types/types'
import { ConvertToTree } from '../../data/lunar/utils'

import Tree, { ITreeNode } from '../../tree/tree'
import { usePrevious } from '@mantine/hooks'

const Explorer: React.FC = ({ }) => {
    const [nodes, setNodes] = useState<Array<ITreeNode>>([])
    const prevNodes = usePrevious(nodes)

    const lunarContext = useContext(LunarContextData) as ILunarState 
    const { data, ui } = lunarContext

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
        lunarContext.setActiveItem(id, type)
        let nNodes = SetActive(nodes, id)       
        setNodes([ ...nNodes ])
    }

    useEffect(() => {
        if(data == null)
            return
        if(ui == null)
            return

        let nNodes = ConvertToTree(data.splits, { 
            deleteProject: lunarContext.deleteProject, 
            createProject: lunarContext.createProject, 
            setExplorerModal: lunarContext.setExplorerModal, 
            deleteIndicator: lunarContext.deleteIndicator 
        }) 

        if(nNodes === undefined)
            return
        //set the active from the ui
        nNodes = SetActive(nNodes, ui.visual_id)

        //setDataNodes([ ...nNodes ])
        setNodes([ ...nNodes ]) 
    }, [data, ui])

    useEffect(() => {
        if(ui?.active_id === null || ui?.active_id === undefined)
            return
        
        lunarContext.setDataNodes([ ...nodes ])
    }, [ui?.active_id])

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