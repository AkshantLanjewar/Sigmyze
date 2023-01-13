import { ScrollArea } from "@mantine/core"
import { useContext, useEffect, useRef, useState } from "react"
import { LunarContextData } from "../../data/lunar/context/context"
import { IDocument, IDocumentBlock, IDocumentPage } from "../../data/lunar/document-types"
import { ILunarState, IProjectNode, IProjectNodeData } from "../../data/lunar/types"
import { ChartDims } from "../chart-view/engine/types"
import DocumentBlock from "./document-block"

import styles from './document-editor.module.scss'

const DEFAULT_DOCUMENT = {
    pages: [{
        blocks: []
    }] as IDocumentPage[]
} as IDocument

interface IDocumentEditorProps {
    tabId: string
}

const DocumentEditor: React.FC<IDocumentEditorProps> = ({ tabId }): JSX.Element => {
    const { 
        getNodeIdTab,
        getNode,
        setNode,
        data 
    } = useContext(LunarContextData) as ILunarState

    const [internalData, setInternalData] = useState<IDocument | null>(null)

    function FetchNode(): IDocument | null {
        let nodeId = getNodeIdTab(tabId)
        let node = nodeId ? getNode(nodeId) as IProjectNode | null : null
        if(node === null)
            return null

        let nodeDocument = node.data?.document
        if(nodeDocument === undefined) {
            if(node.data === undefined)
                node.data = {} as IProjectNodeData
            
            node.data.document = DEFAULT_DOCUMENT
            setNode(node)
            return null
        }

        return nodeDocument
    }

    useEffect(() => {
        let node = FetchNode()  
        if(node === null)
            return

        setInternalData({ ...node }) 
    }, [])

    useEffect(() => {
        let node = FetchNode()
        if(node === null)
            return

        setInternalData({ ...node }) 
    }, [data])

    return (
        <div className={styles['document-editor-wrapper']}>
            <div className={styles.documentScroll}>
                {internalData?.pages.map((step, index) => {
                    return (
                        <div className={styles.page}>
                            
                            {index === internalData.pages.length - 1 && (
                                <DocumentBlock 
                                    leaf={true}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default DocumentEditor