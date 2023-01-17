import { ScrollArea } from "@mantine/core"
import { useContext, useEffect, Dispatch, useState, SetStateAction } from "react"
import { LunarContextData } from "../../data/lunar/context/context"
import { IDocument, IDocumentBlock, IDocumentMenuItem, IDocumentPage } from "../../data/lunar/document-types"
import { ILunarState, IProjectNode, IProjectNodeData } from "../../data/lunar/types"
import { v4 } from "uuid"
import DocumentBlock from "./document-block"

import styles from './document-editor.module.scss'
import SlashMenu from "./slash-menu/slash-menu"
import { ChartDims } from "../chart-view/engine/types"
import RegisterMenu from "./slash-menu/reigster-menu"

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
type changeBlockType = (type: IDocumentMenuItem) => void

type oldInput = { oldInputValue: string | null, setOldInputValue: Dispatch<SetStateAction<string | null>> }
type inputActiveState = { inputActive: boolean, setInputActive: Dispatch<SetStateAction<boolean>> }
type inputValueState = { inputValue: string, setInputValue: Dispatch<SetStateAction<string>> }
type menuPosState = { menuPos: ChartDims, setMenuPos: Dispatch<SetStateAction<ChartDims>> }
type closeMenuState = { closeMenuFlag: boolean, setCloseMenuFlag: Dispatch<SetStateAction<boolean>> }
type inputIdState = { inputId: string | null, setInputId: Dispatch<SetStateAction<string | null>> }

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
    const [inputId, setInputId] = useState<string | null>(null)
    const [menuPos, setMenuPos] = useState<ChartDims>({ x: 0, y: 0 })
    const [menuItems, setMenuItems] = useState<IDocumentMenuItem[]>([])
    const [closeMenuFlag, setCloseMenuFlag] = useState(false)

    const [leafMenuItem, setLeafMenuItem] = useState<IDocumentMenuItem | null>(null)
    const [leafMenuUpdate, setLeafMenuUpdate] = useState(false)

    function setLeafMenuItm(item: IDocumentMenuItem) {
        setLeafMenuItem(item)
        setLeafMenuUpdate(!leafMenuUpdate)
    }

    function closeMenu() {
        setCloseMenuFlag(!closeMenuFlag)
    }

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

        let nMenuItems = RegisterMenu()
        setMenuItems([ ...nMenuItems ])
    }, [])

    //block functions

    function UnfocusBlocks() {
        let nData = internalData
        let nBlocks = []

        for(let i = 0; i < nData.pages[0].blocks.length; i++) {
            let block = nData.pages[0].blocks[i]
            block.autoFocus = false
            block.created = false
            nBlocks.push(block)
        }

        nData.pages[0].blocks = nBlocks
        setInternalData({ ...nData })
    }

    function CreateBlock(block: IDocumentBlock, index: number, focus?: boolean) {
        UnfocusBlocks()

        let pages = internalData.pages
        if(focus !== undefined)
            block.autoFocus = focus
        block.created = true

        if(pages[0].blocks.length === index)
            pages[pages.length - 1].blocks.push(block)
        else
            pages[0].blocks.splice(index, 0, block)

        let nData = internalData
        nData.pages = pages
        setInternalData({ ...nData })
    }

    function ChangeBlockType(type: IDocumentMenuItem) {
        let nData = internalData
        let blocks = nData.pages[0].blocks
        let nBlocks = []
        let blockId = null

        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.id !== inputId) {
                nBlocks.push(block)
                continue
            }

            let nBlock = type.config
            nBlock.id = block.id
            nBlock.textNodes = block.textNodes
            nBlock.autoFocus = false
            nBlocks.push(nBlock)

            blockId = block.id
        }

        nData.pages[0].blocks = nBlocks
        setInternalData({ ...nData })

        if(blockId !== null)
            FocusId(blockId)
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

    function FocusId(id: string) {
        UnfocusBlocks()

        let nData = internalData
        let blocks = nData.pages[0].blocks
        let nBlocks = []
        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            block.autoFocus = false
            if(block.id === id)
                block.autoFocus = true

            nBlocks.push(block)
        }

        nData.pages[0].blocks = nBlocks
        setInternalData({ ...nData })
    }

    function MoveFocus(id: string, direction: "up" | "down") {
        UnfocusBlocks()

        let nData = internalData
        let blocks = nData.pages[0].blocks
        let direction_id = null
        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.id !== id)
                continue

            switch(direction) {
                case "up":
                    if(i === 0)
                        direction_id = blocks[blocks.length - 1].id
                    else
                        direction_id = blocks[i - 1].id
                    break
                case "down":
                    if(i === blocks.length - 1)
                        direction_id = blocks[0].id
                    else
                        direction_id = blocks[i + 1].id
                    break
                default:
                    break
            }
        }

        if(direction_id === null && id === "leaf-block") {
            switch(direction) {
                case "up":
                    direction_id = blocks[blocks.length - 1].id
                    break
                case "down":
                    direction_id = blocks[0].id
                    break
                default:
                    break
            }
        }

        if(direction_id !== null)
            FocusId(direction_id)
    }

    function DeleteBlock(id: string) {
        UnfocusBlocks()

        let nData = internalData
        let nBlocks = [] as IDocumentBlock[]
        let prevId = null

        for(let i = 0; i < nData.pages[0].blocks.length; i++) {
            let block = nData.pages[0].blocks[i]
            if(block.id === id) {
                if(i > 0)
                    prevId = nBlocks[i - 1].id
                continue
            }

            nBlocks.push(block)
        }

        nData.pages[0].blocks = nBlocks
        setInternalData({ ...nData })

        if(prevId !== null)
            FocusId(prevId)
    }

    return (
        <div className={styles['document-editor-wrapper']}>
            <SlashMenu 
                position={menuPos}
                inputActive={inputActive}
                inputValue={inputValue}
                inputId={inputId}
                menuItems={menuItems}
                closeMenu={closeMenu}
                changeBlockType={ChangeBlockType}
                setLeafMenuItm={setLeafMenuItm}
            />

            <div className={styles.documentScroll}>
                <div className={styles['page-wrapper']}>
                    {internalData?.pages.map((step: IDocumentPage, index: number) => {
                        return (
                            <div className={styles.page}>
                                {step.blocks.map((step, index) => (
                                    <DocumentBlock
                                        leaf={false}
                                        leafMenuItem={leafMenuItem}
                                        leafMenuUpdate={leafMenuUpdate}
                                        createBlock={CreateBlock}
                                        updateBlock={UpdateBlock}
                                        deleteBlock={DeleteBlock}
                                        moveFocus={MoveFocus}
                                        block={step}
                                        index={index}
                                        autoFocus={step.autoFocus}
                                        oldInput={{ oldInputValue, setOldInputValue }}
                                        inputActive={{ inputActive, setInputActive }}
                                        inputValue={{ inputValue, setInputValue }}
                                        menuPosState={{ menuPos, setMenuPos }}
                                        closeMenuState={{ closeMenuFlag, setCloseMenuFlag }}
                                        inputIdState={{ inputId, setInputId }}
                                    />
                                ))}

                                <DocumentBlock 
                                    leaf={true}
                                    leafMenuItem={leafMenuItem}
                                    leafMenuUpdate={leafMenuUpdate}
                                    createBlock={CreateBlock}
                                    updateBlock={UpdateBlock}
                                    moveFocus={MoveFocus}
                                    deleteBlock={DeleteBlock}
                                    setLastActive={SetLastActive}
                                    index={internalData.pages[0].blocks.length}
                                    oldInput={{ oldInputValue, setOldInputValue }}
                                    inputActive={{ inputActive, setInputActive }}
                                    inputValue={{ inputValue, setInputValue }}
                                    menuPosState={{ menuPos, setMenuPos }}
                                    closeMenuState={{ closeMenuFlag, setCloseMenuFlag }}
                                    inputIdState={{ inputId, setInputId }}
                                />
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
    menuPosState,
    closeMenuState,
    inputIdState,
    changeBlockType
}