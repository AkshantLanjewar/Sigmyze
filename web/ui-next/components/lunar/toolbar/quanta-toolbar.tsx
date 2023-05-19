import styles   from './toolbar.module.scss'
import dropdownStyles from '../explorer/explorer.module.scss'
import { Text } from '@mantine/core'
import { useContext, useEffect, useState } from 'react'
import { QuantaContextData } from '../../data/quanta/context'
import { IQuantaState } from '../../data/quanta/types'
import Tree, { ITreeNode } from '../../tree/tree'
import { v4 } from 'uuid'

const QuantaToolbar: React.FC = ({ }) => {
    const [nodes, setNodes] = useState<Array<ITreeNode>>([])

    const quantaContext = useContext(QuantaContextData) as IQuantaState
    let quantaData = quantaContext.project_data
    let quantaFiles = quantaData?.files
    let tabId = quantaContext.tabId

    useEffect(() => {
        buildToolbar()
    }, [])
    
    useEffect(() => {
        buildToolbar()
    }, [quantaFiles])

    useEffect(() => {
        let tabs = quantaContext.tabs
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

    //convert projectData to the toolbar
    function buildToolbar() {
        if(quantaData === undefined)
            return
        if(quantaFiles === undefined)
            return

        let nNodes = [] as ITreeNode[]
        nNodes.push({
            node_id: v4(),
            node_title: quantaData?.dataset_name,
            node_type: "dataset",
            children: [],
            opened: true
        } as ITreeNode)

        for(let i = 0; i < quantaFiles.length; i++) {
            let file = quantaFiles[i]
            let fileNode = {
                node_id: file.id,
                node_title: file.name,
                node_type: file.type,
                children: [],
                
            } as ITreeNode

            nNodes[0].children.push(fileNode)
        }

        setNodes([ ...nNodes ])
    }

    //resets all the nodes to unactive
    function deactivateNodes(pNodes: ITreeNode[]) {
        let nNodes = [] as ITreeNode[]
        for(let i = 0; i < pNodes.length; i++) {
            let node = pNodes[i]
            node.active = false
            node.children = deactivateNodes(node.children)

            nNodes.push(node)
        }

        return nNodes
    }

    //function that handles the setActive event from the tree
    //focuses the tab on the viewport if it is a quanta file
    function setActive(id: string, type: string) {
        let nTreeNodes = nodes
        nTreeNodes = deactivateNodes(nTreeNodes)

        if(type === "dataset")
            nTreeNodes[0].active = true

        for(let i = 0; i < nTreeNodes[0].children.length; i++) {
            let node = nTreeNodes[0].children[i]
            if(node.node_id === id) {
                quantaContext.focusTab(id, type)
                node.active = true
            }

            nTreeNodes[0].children[i] = node
        }

        setNodes([ ...nTreeNodes ])
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.stackViewport}>
                <div className={styles.title}>
                    <Text 
                        size={"xs"}
                        weight={"bold"}
                        color={"dimmed"}
                        transform={"uppercase"}
                    >
                        Quanta Editor
                    </Text>
                </div>

                <div style={{ marginTop: 0, position: 'relative', height: '100%' }}>
                    <div className={dropdownStyles['scroll-wrapper']}>
                        <div className={dropdownStyles.content}>
                            <Tree nodes={nodes} setActive={setActive} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuantaToolbar