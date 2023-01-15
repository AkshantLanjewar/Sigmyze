import { ScrollArea } from "@mantine/core"
import { useContext, useEffect, Dispatch, useState, SetStateAction } from "react"
import { LunarContextData } from "../../data/lunar/context/context"
import { IDocument, IDocumentBlock, IDocumentPage } from "../../data/lunar/document-types"
import { ILunarState, IProjectNode, IProjectNodeData } from "../../data/lunar/types"
import { v4 } from "uuid"
import DocumentBlock from "./document-block"

import styles from './document-editor.module.scss'
import SlashMenu from "./slash-menu/slash-menu"
import { ChartDims } from "../chart-view/engine/types"

const DEFAULT_DOCUMENT = {
    pages: [{
        blocks: []
    }] as IDocumentPage[]
} as IDocument

interface IDocumentEditorProps {
    tabId: string
}

type createBlock = (block: IDocumentBlock, index: number, focus?: boolean) => void
type updateBlock = (block: IDocumentBlock) => void    
type deleteBlock = (id: string) => void
type setLastActive = () => void

type oldInput = { oldInputValue: string | null, setOldInputValue: Dispatch<SetStateAction<string | null>> }
type inputActiveState = { inputActive: boolean, setInputActive: Dispatch<SetStateAction<boolean>> }
type inputValueState = { inputValue: string, setInputValue: Dispatch<SetStateAction<string>> }
type menuPosState = { menuPos: ChartDims, setMenuPos: Dispatch<SetStateAction<ChartDims>> }

const DocumentEditor: React.FC<IDocumentEditorProps> = ({ tabId }): JSX.Element => {
    const { 
        getNodeIdTab,
        getNode,
        setNode,
        data 
    } = useContext(LunarContextData) as ILunarState

    const [internalData, setInternalData] = useState<IDocument>(DEFAULT_DOCUMENT)
    const [oldInputValue, setOldInputValue] = useState<string | null>(null)
    const [inputActive, setInputActive] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [menuPos, setMenuPos] = useState<ChartDims>({ x: 0, y: 0 })

    function FetchNode() {
        let nodeId = getNodeIdTab(tabId)
        let node = nodeId ? getNode(nodeId) as IProjectNode | null : null
        if(node === null)
            return

        let documentId = node.data?.document_id
        if(documentId === undefined) {
            if(node.data === undefined)
                node.data = {} as IProjectNodeData
            
            node.data.document_id = v4()
            setNode(node)
            return null
        }
 
    }

    useEffect(() => {
        FetchNode()
    }, [])

    //block functions

    function UnfocusBlocks() {
        let nData = internalData
        let nBlocks = []

        for(let i = 0; i < nData.pages[0].blocks.length; i++) {
            let block = nData.pages[0].blocks[i]
            block.autoFocus = false
            nBlocks.push(block)
        }

        nData.pages[0].blocks = nBlocks
        setInternalData({ ...nData })
    }

    function CreateBlock(block: IDocumentBlock, index: number, focus?: boolean) {
        UnfocusBlocks()

        let pages = internalData.pages
        if(focus === true)
            block.autoFocus = focus

        if(pages[0].blocks.length === index)
            pages[pages.length - 1].blocks.push(block)
        else
            pages[0].blocks.splice(index, 0, block)

        let nData = internalData
        nData.pages = pages
        setInternalData({ ...nData })
    }

    function UpdateBlock(block: IDocumentBlock) {
        let nData = internalData
        let pages = nData.pages
        for(let i = 0; i < pages.length; i++) {
            let page = pages[i]
            let nBlocks = []
            for(let x = 0; x < page.blocks.length; x++) {
                let block_ = page.blocks[x]
                
                if(block.id === block_.id)
                    nBlocks.push(block)
                else
                    nBlocks.push(block_)
            }

            page.blocks = nBlocks
            pages[i] = page
        }

        nData.pages = pages
        setInternalData({ ...nData })
    }

    function SetLastActive() {
        UnfocusBlocks()
        
        let nData = internalData
        let blocks = nData.pages[0].blocks
        if(blocks.length > 0)
            blocks[blocks.length - 1].autoFocus = true

        nData.pages[0].blocks = blocks

        setInternalData({ ...nData })
    }

    function DeleteBlock(id: string) {
        UnfocusBlocks()

        let nData = internalData
        let nBlocks = [] as IDocumentBlock[]
        let index = null

        for(let i = 0; i < nData.pages[0].blocks.length; i++) {
            let block = nData.pages[0].blocks[i]
            if(block.id === id) {
                index = i - 1
                continue
            }

            nBlocks.push(block)
        }

        for(let i = 0; i < nBlocks.length; i++) {
            let block = nBlocks[i]
            block.autoFocus = false
            if(index !== null && i === index)
                block.autoFocus = true

            nBlocks[i] = block
        }

        nData.pages[0].blocks = nBlocks
        setInternalData({ ...nData })
    }

    return (
        <div className={styles['document-editor-wrapper']}>
            <SlashMenu 
                position={menuPos}
                inputActive={inputActive}
                inputValue={inputValue}
            />

            <div className={styles.documentScroll}>
                <div className={styles['page-wrapper']}>
                    {internalData?.pages.map((step: IDocumentPage, index: number) => {
                        return (
                            <div className={styles.page}>
                                {step.blocks.map((step, index) => (
                                    <DocumentBlock
                                        leaf={false}
                                        createBlock={CreateBlock}
                                        updateBlock={UpdateBlock}
                                        deleteBlock={DeleteBlock}
                                        block={step}
                                        index={index}
                                        autoFocus={step.autoFocus}
                                        oldInput={{ oldInputValue, setOldInputValue }}
                                        inputActive={{ inputActive, setInputActive }}
                                        inputValue={{ inputValue, setInputValue }}
                                        menuPosState={{ menuPos, setMenuPos }}
                                    />
                                ))}

                                {index === internalData.pages.length - 1 && (
                                    <DocumentBlock 
                                        leaf={true}
                                        createBlock={CreateBlock}
                                        updateBlock={UpdateBlock}
                                        deleteBlock={DeleteBlock}
                                        setLastActive={SetLastActive}
                                        index={internalData.pages[0].blocks.length}
                                        oldInput={{ oldInputValue, setOldInputValue }}
                                        inputActive={{ inputActive, setInputActive }}
                                        inputValue={{ inputValue, setInputValue }}
                                        menuPosState={{ menuPos, setMenuPos }}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default DocumentEditor
export type { 
    createBlock, 
    updateBlock, 
    deleteBlock,
    setLastActive,
    oldInput,
    inputActiveState,
    inputValueState,
    menuPosState
}