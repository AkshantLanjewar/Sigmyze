import { SetStateAction, useEffect, useState } from "react"
import { v4 } from "uuid"
import { IChartBlockData, IDocumentBlock, IDocumentMenuItem, MediaTypes, TextTypes } from '../../data/lunar/types/document-types'
import { ChartDims } from "../chart-view/engine/types"
import ChartBlock from "./blocks/data/chart-block"
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
import CreateChartModal from "./modals/create-chart-modal"
import CreateImageModal from "./modals/create-image-modal"

interface ICreateMediaBlockData {
    imageData?: string,
    width?: string | number,
    height?: number,
    chartData?: IChartBlockData
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
    
    //set the block to be a leaf block if this is a leaf block
    useEffect(() => {
        if(leaf === true)
            setInternalBlock(LEAF_BLOCK)
    }, [])

    //if the leaf menu has updated
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

    //update the block state based on the external value
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
        if(block_.chartData !== undefined)
            return true

        let blockType = block_.type
        //actoin to take based on the block type
        switch(blockType) {
            case "paragraph":
                return true
            case "title":
                return true
            case "image":
                if(block_.imageData === undefined)
                    setActiveModal("create_image")    
                break
            case "chart":
                if(block_.chartId === undefined)
                    setActiveModal("create_chart")
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

    //closes the modal
    function closeModal() {
        setActiveModal(null)
    }

    //creates a media oriented block such as charts and images
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
        } else if (type === "chart") {
            nBlock.chartData = data.chartData
            nBlock.width = data.width
            nBlock.height = data.height
        }
        
        if(leaf === true) {
            nBlock.id = v4()
            createBlock(nBlock, index, false)
        }
        else
            updateBlock(nBlock)
    }

    //default create new block
    function createBlockWrapper(callback: () => void) {
        if(createBlock === undefined)
            return

        let nBlock = {
            type: "paragraph",
            textNodes: [],
            id: v4(),
            leaf: false
        } as IDocumentBlock

        createBlock(nBlock, index + 1, true)
        callback()
    }

    //default delete block
    function deleteBlockWrapper() {
        if(deleteBlock === undefined)
            return
        if(block === undefined)
            return
        
        deleteBlock(block.id)
    }

    //updates block size based on resize wrapper
    function updateSizeWrapper(dims: ChartDims | null) {
        if(internalBlock === null)
            return
        if(updateBlock === undefined)
            return

        let width = 0
        let height = 0
        if(dims !== null) {
            width = dims.x
            height = dims.y
        }
        
        let nBlock = internalBlock
        nBlock.width = width
        nBlock.height = height

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
                    index={index}
                    getImage={getImage}
                    setActiveModal={setActiveModal}
                    createBlockWrapper={createBlockWrapper}
                    deleteBlockWrapper={deleteBlockWrapper}
                    updateSizeWrapper={updateSizeWrapper}
                />
            )}

            {internalBlock?.type === "chart" && (
                <ChartBlock
                    block={internalBlock}
                    createBlockWrapper={createBlockWrapper}
                    deleteBlockWrapper={deleteBlockWrapper}
                    setActiveModal={setActiveModal}
                    updateSizeWrapper={updateSizeWrapper}
                />
            )}

            <CreateImageModal 
                active={activeModal === "create_image"}
                close={closeModal}
                createBlock={createMediaBlock}
                loadImage={loadImage}
            />

            <CreateChartModal
                active={activeModal === "create_chart"}
                close={closeModal}
                createBlock={createMediaBlock}
            /> 
        </div>
    )
}

export type { ICreateMediaBlockData }
export default DocumentBlock