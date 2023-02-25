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

    useEffect(() => {
        buildToolbar()
    }, [])
    
    useEffect(() => {
        buildToolbar()
    }, [quantaFiles])

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
                children: []
            } as ITreeNode

            nNodes[0].children.push(fileNode)
        }

        setNodes([ ...nNodes ])
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
                            <Tree nodes={nodes} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuantaToolbar