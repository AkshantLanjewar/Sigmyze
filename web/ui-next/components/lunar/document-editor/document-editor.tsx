import { ScrollArea } from "@mantine/core"
import { useContext, useEffect, Dispatch, useState, SetStateAction } from "react"
import { LunarContextData } from "../../data/lunar/context"
import { IDocument, IDocumentBlock, IDocumentMenuItem, IDocumentPage } from "../../data/lunar/types/document-types"
import { ILunarState, IProjectNode, IProjectNodeData } from "../../data/lunar/types/types"
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

/**
 * @description
 *  this is the document editor for the editor.
 *  wrapper for all components relating to it. 
 * @param tabId
 *  this is the id of the current tab to retreive data
 * @returns 
 */
const DocumentEditor: React.FC<IDocumentEditorProps> = ({ tabId }): JSX.Element => {
    const lunarContext = useContext(LunarContextData) as ILunarState

    /**
     * @state
     * @description
     *  this is the internal block state of the document
     */
    const [internalData, setInternalData] = useState<IDocument>(DEFAULT_DOCUMENT)

    /**
     * @state
     * @description
     *  This is the value of the input before / was pressed
     */
    const [oldInputValue, setOldInputValue] = useState<string | null>(null)

    /**
     * @state
     * @description
     *  whether or not input menu is opened
     */
    const [inputActive, setInputActive] = useState(false)

    /**
     * @state
     * @description
     *  this is the current search query for the input
     */
    const [inputValue, setInputValue] = useState("")

    /**
     * @state
     * @description
     *  this is the id of the block where the menu is active
     */
    const [inputId, setInputId] = useState<string | null>(null)

    /**
     * @state
     * @param x
     *  this is the x pos of the menu
     * @param y
     *  this is the y pos the menu
     * @description
     *  this is the position of the slash menu in the viewport
     */
    const [menuPos, setMenuPos] = useState<ChartDims>({ x: 0, y: 0 })

    /**
     * @state
     * @description
     *  theese are the menu items that will appear for the slash menu
     */
    const [menuItems, setMenuItems] = useState<IDocumentMenuItem[]>([])

    /**
     * @state
     * @description
     *  flag to close the slash menu or not
     */
    const [closeMenuFlag, setCloseMenuFlag] = useState(false)

    /**
     * @state
     * @description
     *  when the leaf menu updates, it stores which block it wants to update to
     *  in this object.
     */
    const [leafMenuItem, setLeafMenuItem] = useState<IDocumentMenuItem | null>(null)

    /**
     * @state
     * @description
     *  this is the flag to toggle whether or not the leaf menu should update
     */
    const [leafMenuUpdate, setLeafMenuUpdate] = useState(false)

    /**
     * @state
     * @description
     *  this is the flag to update the project with the server
     */
    const [updateProject, setUpdateProject] = useState(false)
    
    /**
     * @function
     * @description
     *  this toggles the updating the project with the server
     * @returns void
     */
    const toggleUpdateProject = () => setUpdateProject(!updateProject)

    /**
     * @state
     * @description
     *  this is the id of the document in the editor
     */
    const [documentId, setDocumentId] = useState<string | null>(null)

    /**
     * @function
     * @description
     *  this function changes the leaf to specified block type
     * @param item
     *  the item the leaf needs to be set to 
     */
    function setLeafMenuItm(item: IDocumentMenuItem) {
        setLeafMenuItem(item)
        setLeafMenuUpdate(!leafMenuUpdate)
    }

    /**
     * @function
     * @description
     *  this closes the slash menu no matter what
     */
    function closeMenu() {
        setCloseMenuFlag(!closeMenuFlag)
    }

    /**
     * @function
     * @description
     *  this fetches the document id from the related node in the editor
     * @returns void
     */
    function FetchNode() {
        let nodeId = lunarContext.getNodeIdTab(tabId)
        let node = nodeId ? lunarContext.getNode(nodeId) as IProjectNode | null : null
        if(node === null)
            return

        let documentId = node.data?.document_id
        if(documentId === undefined) {
            if(node.data === undefined)
                node.data = {} as IProjectNodeData
            
            node.data.document_id = v4()

            setDocumentId(node.data.document_id)
            lunarContext.setNode(node)
            return
        }
        
        setDocumentId(documentId)
    }

    /**
     * This sets up the document editor data 
     * when the component is created.
     */
    useEffect(() => {
        setInternalData(DEFAULT_DOCUMENT)
        FetchNode()

        let nMenuItems = RegisterMenu()
        setMenuItems([ ...nMenuItems ])
    }, [])

    //same as above
    useEffect(() => {
        FetchNode()

        let nMenuItems = RegisterMenu()
        setMenuItems([ ...nMenuItems ])
    }, [tabId])

    /**
     * @effect
     * @description
     *  this effect grabs the data from the document list in the project
     */
    useEffect(() => {
        if(documentId === null)
            return

        let document = lunarContext.grabDocument(documentId)
        if(document === null)
            return

        let data = document.data
        setInternalData({ ...data })
    }, [documentId])

    /**
     * effect that updates the server with the project data when toggled
     */
    useEffect(() => {
        if(documentId === null)
            return
        if(internalData === undefined)
            return

        lunarContext.setDocument(documentId, internalData)
    }, [updateProject])

    //create the functions from the definitions
    
    //block functions
    /**
     * @function
     * @description
     *  this function creates a new block in the editor after the cursor's index.
     * @param block
     *  this is the text block being created 
     * @param index 
     *  the index which the cursor is at
     * @param focus 
     *  whether or not to focus to the block when it is created
     */
    const createBlock = (block: IDocumentBlock, index: number, focus?: boolean) =>
        CreateBlock(block, index, internalData, unfocusBlocks, setInternalData, toggleUpdateProject, focus)

    /**
     * @function
     * @description
     *  this function deletes a block from the editor
     * @param id 
     *  this is the id of the block being deleted
     */
    const deleteBlock = (id: string) => 
        DeleteBlock(id, internalData, unfocusBlocks, setInternalData, toggleUpdateProject)
    
    /**
     * @function
     * @description
     *  this updates a block within the document editor
     * @param block
     *  this is the block being updateed
     */
    const updateBlock = (block: IDocumentBlock) =>
        UpdateBlock(block, internalData, setInternalData, toggleUpdateProject)
    
    /**
     * @function
     * @description
     *  this changes a block to the new requested type
     * @param type
     *  this is the new type the block is being switched too
     */
    const changeBlockType = (type: IDocumentMenuItem) =>
        ChangeBlockType(type, inputId, internalData, unfocusBlocks, setInternalData, toggleUpdateProject)

    //data functions
    /**
     * @function
     * @description
     *  this function loads an image into the documents image store
     * @param imageData
     *  the base64 image
     */
    const loadImage = (imageData: string) => LoadImage(imageData, internalData, setInternalData)
    
    /**
     * @description
     *  this function retreives an image from the documents image store
     * @param id 
     *  the id of the image being retreived
     * @returns base64 of image | null
     */
    const getImage = (id: string) => GetImage(id, internalData)

    //focus functions
    /**
     * @description
     *  this functino moves the focus from the currently selected block
     *  to the block either below or above
     * @param id
     *  this is the id of the currently focused block 
     * @param direction 
     *  direction where we want the focus to travel
     */
    const moveFocus = (id: string, direction: "up" | "down") =>
        MoveFocus(id, direction, internalData, unfocusBlocks, setInternalData)

    /**
     * @description
     *  this unfocuses all the block int the editor
     */
    const unfocusBlocks = () =>
        UnfocusBlocks(internalData, setInternalData)
    
    /**
     * @description
     *  this sets the block before the last active block to be active
     *  used when the current block is deleted
     */
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

export { DEFAULT_DOCUMENT }
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