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
import { ChangeBlockType, CreateBlock, DeleteBlock, GetImage, LoadImage, MoveFocus, SetLastActive, UnfocusBlocks, UpdateBlock } from "./functions/functions"

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

    //create the functions from the definitions
    
    //block functions
    const createBlock = (block: IDocumentBlock, index: number, focus?: boolean) =>
        CreateBlock(block, index, internalData, unfocusBlocks, setInternalData, focus)
    const deleteBlock = (id: string) => 
        DeleteBlock(id, internalData, unfocusBlocks, setInternalData)
    const updateBlock = (block: IDocumentBlock) =>
        UpdateBlock(block, internalData, setInternalData)
    const changeBlockType = (type: IDocumentMenuItem) =>
        ChangeBlockType(type, inputId, internalData, unfocusBlocks, setInternalData)

    //data functions
    const loadImage = (imageData: string) => LoadImage(imageData, internalData, setInternalData)
    const getImage = (id: string) => GetImage(id, internalData)

    //focus functions
    const moveFocus = (id: string, direction: "up" | "down") =>
        MoveFocus(id, direction, internalData, unfocusBlocks, setInternalData)
    const unfocusBlocks = () =>
        UnfocusBlocks(internalData, setInternalData)
    const setLastActive = () =>
        SetLastActive(internalData, setInternalData)

    return (
        <div className={styles['document-editor-wrapper']}>
            <SlashMenu 
                position={menuPos}
                inputActive={inputActive}
                inputValue={inputValue}
                inputId={inputId}
                menuItems={menuItems}
                closeMenu={closeMenu}
                changeBlockType={changeBlockType}
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
                                        createBlock={createBlock}
                                        updateBlock={updateBlock}
                                        deleteBlock={deleteBlock}
                                        moveFocus={moveFocus}
                                        block={step}
                                        index={index}
                                        autoFocus={step.autoFocus}
                                        oldInput={{ oldInputValue, setOldInputValue }}
                                        inputActive={{ inputActive, setInputActive }}
                                        inputValue={{ inputValue, setInputValue }}
                                        menuPosState={{ menuPos, setMenuPos }}
                                        closeMenuState={{ closeMenuFlag, setCloseMenuFlag }}
                                        inputIdState={{ inputId, setInputId }}
                                        loadImage={loadImage}
                                        getImage={getImage}
                                    />
                                ))}

                                <DocumentBlock 
                                    leaf={true}
                                    leafMenuItem={leafMenuItem}
                                    leafMenuUpdate={leafMenuUpdate}
                                    createBlock={createBlock}
                                    updateBlock={updateBlock}
                                    moveFocus={moveFocus}
                                    deleteBlock={deleteBlock}
                                    setLastActive={setLastActive}
                                    index={internalData.pages[0].blocks.length}
                                    oldInput={{ oldInputValue, setOldInputValue }}
                                    inputActive={{ inputActive, setInputActive }}
                                    inputValue={{ inputValue, setInputValue }}
                                    menuPosState={{ menuPos, setMenuPos }}
                                    closeMenuState={{ closeMenuFlag, setCloseMenuFlag }}
                                    inputIdState={{ inputId, setInputId }}
                                    loadImage={loadImage}
                                    getImage={getImage}
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