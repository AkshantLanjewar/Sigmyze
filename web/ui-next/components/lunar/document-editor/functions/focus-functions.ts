import { SetStateAction } from "react"
import { IDocument } from "../../../data/lunar/document-types"

function FocusId(
    id: string,
    internalData: IDocument,
    unfocusBlocks: () => void,
    setInternalData: (value: SetStateAction<IDocument>) => void,
) {
    unfocusBlocks()

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

function MoveFocus(
    id: string, 
    direction: "up" | "down",
    internalData: IDocument,
    unfocusBlocks: () => void,
    setInternalData: (value: SetStateAction<IDocument>) => void,
) {
    unfocusBlocks()

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
        FocusId(direction_id, internalData, unfocusBlocks, setInternalData)
}

function UnfocusBlocks(
    internalData: IDocument,
    setInternalData: (value: SetStateAction<IDocument>) => void,
) {
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

function SetLastActive(
    internalData: IDocument,
    setInternalData: (value: SetStateAction<IDocument>) => void,
) {
    UnfocusBlocks(internalData, setInternalData)
    
    let nData = internalData
    let blocks = nData.pages[0].blocks
    if(blocks.length > 0)
        blocks[blocks.length - 1].autoFocus = true

    nData.pages[0].blocks = blocks

    setInternalData({ ...nData })
}

export { 
    FocusId,
    MoveFocus,
    UnfocusBlocks,
    SetLastActive 
}