import { useEffect, useState } from "react"
import { v4 } from "uuid"
import { IDocumentBlock, IDocumentMenuItem, MediaTypes, TextTypes } from '../../data/lunar/document-types'
import ImageBlock from "./blocks/media/image-block"
import TextBlock from "./blocks/text/text-block"
import { 
    createBlock, 
    deleteBlock, 
    inputActiveState, 
    inputValueState, 
    menuPosState, 
    oldInput, 
    setLastActive, 
    updateBlock,
    closeMenuState, 
    inputIdState
} from "./document-editor"
import CreateImageModal from "./modals/create-image-modal"

interface ICreateMediaBlockData {
    imageData?: string,
    width?: string | number,
    height?: number
}

interface IDocumentBlockProps {
    leaf?: boolean,
    createBlock?: createBlock,
    updateBlock?: updateBlock,
    deleteBlock?: deleteBlock,
    setLastActive?: setLastActive,
    block?: IDocumentBlock,
    autoFocus?: boolean,
    index: number,
    oldInput: oldInput,
    inputActive: inputActiveState,
    inputValue: inputValueState,
    menuPosState: menuPosState,
    closeMenuState: closeMenuState,
    inputIdState: inputIdState,

    leafMenuUpdate: boolean,
    leafMenuItem: IDocumentMenuItem | null,
    moveFocus: (id: string, direction: "up" | "down") => void,
    loadImage: (imageData: string) => string,
    getImage: (id: string) => string | null
}

const LEAF_BLOCK = {
    type: "paragraph",
    leaf: true,
    id: "leaf-block"
} as IDocumentBlock

const DocumentBlock: React.FC<IDocumentBlockProps> = 
({ 
    leaf, 
    createBlock, 
    updateBlock, 
    block, 
    index, 
    autoFocus, 
    deleteBlock, 
    setLastActive, 
    oldInput, 
    inputActive, 
    inputValue,
    menuPosState,
    closeMenuState,
    inputIdState,
    leafMenuItem,
    leafMenuUpdate,
    moveFocus,
    loadImage,
    getImage 
}) => {
    const [internalBlock, setInternalBlock] = useState<IDocumentBlock | null>(null)
    const [activeModal, setActiveModal] = useState<string | null>(null)
    
    useEffect(() => {
        if(leaf === true)
            setInternalBlock(LEAF_BLOCK)
    }, [])

    useEffect(() => {
        if(leafMenuItem === null)
            return
        if(internalBlock === null)
            return
        if(leaf === false)
            return
        let nBlock = leafMenuItem.config
        if(nBlock === undefined || nBlock === null)
            return

        let update = MediaSwitch(nBlock)
        if(update === true) {
            nBlock.id = internalBlock.id
            nBlock.textNodes = internalBlock.textNodes
            nBlock.leaf = true
            setInternalBlock({ ...nBlock })
        }
    }, [leafMenuUpdate])

    useEffect(() => {
        if(block === undefined)
            return
        if(leaf === true)
            return

        let update = MediaSwitch(block)
        if(update === true)
            setInternalBlock({ ...block })
    }, [block, block?.type, block?.order])

    //helper function to activate the modal if the type matches up
    function MediaSwitch(block_: IDocumentBlock) {
        if(block_.imageData !== undefined)
            return true

        let blockType = block_.type
        switch(blockType) {
            case "paragraph":
                return true
            case "title":
                return true
            case "image":
                if(block_.imageData === undefined)
                    setActiveModal("create_image")    
                break
            default:
                break
        }

        return false
    }

    //helper functions
    function resetInternalBlock() {
        setInternalBlock(LEAF_BLOCK)
    }

    function closeModal() {
        setActiveModal(null)
    }

    function createMediaBlock(type: TextTypes | MediaTypes, data: ICreateMediaBlockData) {
        if(internalBlock === null)
            return
        if(createBlock === undefined)
            return
        if(updateBlock === undefined)
            return

        let nBlock = {} as IDocumentBlock
        nBlock.type = type
        nBlock.id = internalBlock.id
        if(type === "image") {
            nBlock.imageData = data.imageData
            nBlock.width = data.width
            nBlock.height = data.height
        }
        
        let indexAddition = 0
        if(leaf === true) {
            nBlock.id = v4()
            indexAddition = 1
        }
        
        if(leaf === true)
            createBlock(nBlock, index + indexAddition, false)
        else
            updateBlock(nBlock)
    }

    return (
        <div>
            {(internalBlock?.type === "paragraph" || internalBlock?.type === "title") && (
                <TextBlock
                    block={internalBlock}
                    index={index}
                    createBlock={createBlock}
                    updateBlock={updateBlock}
                    deleteBlock={deleteBlock}
                    setLastActive={setLastActive}
                    autoFocus={autoFocus}
                    oldInput={oldInput}
                    inputActiveState={inputActive}
                    inputValueState={inputValue}
                    menuPosState={menuPosState}
                    closeMenuState={closeMenuState}
                    inputIdState={inputIdState}
                    resetInternalBlock={resetInternalBlock}
                    moveFocus={moveFocus}
                />
            )}

            {internalBlock?.type === "image" && (
                <ImageBlock 
                    block={internalBlock}
                    getImage={getImage}
                />
            )}

            <CreateImageModal 
                active={activeModal === "create_image"}
                close={closeModal}
                createBlock={createMediaBlock}
                loadImage={loadImage}
            />
        </div>
    )
}

export type { ICreateMediaBlockData }
export default DocumentBlock