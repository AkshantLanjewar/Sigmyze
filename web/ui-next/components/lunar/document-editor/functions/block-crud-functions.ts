import { SetStateAction } from "react";
import { IDocument, IDocumentBlock, IDocumentMenuItem } from "../../../data/lunar/types/document-types";
import { FocusId } from "./functions";

function CreateBlock(
    block: IDocumentBlock, 
    index: number, 
    internalData: IDocument,
    unfocusBlocks: () => void,
    setInternalData: (value: SetStateAction<IDocument>) => void,
    focus?: boolean,
) {
    unfocusBlocks()

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

function DeleteBlock(
    id: string,
    internalData: IDocument,
    unfocusBlocks: () => void,
    setInternalData: (value: SetStateAction<IDocument>) => void,
) {
    unfocusBlocks()

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
        FocusId(prevId, internalData, unfocusBlocks, setInternalData)
}

function UpdateBlock(
    block: IDocumentBlock,
    internalData: IDocument,
    setInternalData: (value: SetStateAction<IDocument>) => void,
) {
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

function ChangeBlockType(
    type: IDocumentMenuItem,
    inputId: string | null,
    internalData: IDocument,
    unfocusBlocks: () => void,
    setInternalData: (value: SetStateAction<IDocument>) => void,
) {
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
        FocusId(blockId, internalData, unfocusBlocks, setInternalData)
}

export { 
    CreateBlock,
    DeleteBlock,
    UpdateBlock,
    ChangeBlockType 
}