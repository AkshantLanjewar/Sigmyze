import { v4 } from "uuid"
import { Blocks, INoteBlock } from "../../types"

/**
 * @description
 *  - this is the recursive function to assist the hook to update a blocks content with the new grouping mechanism
 * @param blocks 
 *  - these are the blocks we are going to be iterating over and recursing through
 * @param blockId 
 *  - the id of the block we want to alter
 * @param blockContent 
 *  - the new content for the block
 */
const updateNoteBlockRECURSE = (
    blocks: INoteBlock[],
    blockId: string,
    blockContent: string
) => {
    let newBlocks: INoteBlock[] = []
    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        if(block.blockId === blockId)
            block.blockContent = blockContent
        if(block.isGroup === true && block.blockChildren !== undefined)
            block.blockChildren = updateNoteBlockRECURSE(block.blockChildren, blockId, blockContent)

        newBlocks.push(block)
    }

    return newBlocks
}

/**
 * @description
 *  - this is the recursive function that changes a blocks type under the new grouping mechanism
 * @param blocks 
 *  - these are the blocks we are going to be recursing through
 * @param blockId 
 *  - the id of the block of which we are trying to change
 * @param newType 
 *  - the new type for the block
 * @param newContent 
 *  - the new content for the block
 */
const changeNoteBlockRECURSE = (
    blocks: INoteBlock[],
    blockId: string,
    newType: Blocks,
    newContent: string
) => {
    let newBlocks: INoteBlock[] = []
    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        if(block.blockId === blockId) {
            block.blockType = newType
            block.blockContent = newContent
        } else if(block.isGroup === true && block.blockChildren !== undefined) {
            block.blockChildren = changeNoteBlockRECURSE(block.blockChildren, blockId, newType, newContent)
        }

        newBlocks.push(block)
    }

    return newBlocks
}

/**
 * @description
 *  - this is the function that recursively deletes a block from the editor
 * @param blocks 
 *  - the blocks we are going to recurse through
 * @param blockId 
 *  - the id of the block that we are trying to delete
 * @param createFocusRequest
 *  - this is the function that creates a focus request within the editor
 */
const deleteNoteBlockRECURSE = (
    blocks: INoteBlock[],
    blockId: string,
    createFocusRequest: (blockId: string) => void
) => {
    let newBlocks: INoteBlock[] = []
    let deleteIndex: number | undefined = undefined
    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        if(block.blockId === blockId) {
            if(block.isGroup === true && block.blockChildren !== undefined) {
                let children = block.blockChildren
                newBlocks.concat(children)
            }

            deleteIndex = i
            continue
        } if(block.isGroup && block.blockChildren !== undefined) {
            block.blockChildren = deleteNoteBlockRECURSE(block.blockChildren, blockId, createFocusRequest)
            if(block.blockChildren.length === 0) {
                block.isGroup = false
                block.blockChildren = undefined
            }
        }

        newBlocks.push(block)
    }


    if(deleteIndex !== undefined && newBlocks.length - 1 < deleteIndex && deleteIndex !== 0 && newBlocks.length !== 0)
        deleteIndex = deleteIndex - 1
    if(deleteIndex !== undefined)
        createFocusRequest(newBlocks[deleteIndex].blockId)
    
    return newBlocks
}

/**
 * @description
 *  - this is the function that appends a new paragraph block after the specified block
 * @param blocks 
 *  - this is the list of blocks that we are going to recurse through
 * @param blockId 
 *  - this is the blockID of the block we want to append a new one after
 * @param createFocusRequest 
 *  - function to create a focus request within the editor
 */
const appendNoteBlockRECURSE = (
    blocks: INoteBlock[],
    blockId: string,
    createFocusRequest: (blockId: string) => void
): { blocks: INoteBlock[], id: string | undefined } => {
    let newBlocks: INoteBlock[] = []
    let newBlockId: string | undefined = undefined

    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        newBlocks.push(block)

        if(block.blockId === blockId) {
            const newBlock: INoteBlock = { blockId: v4(), blockContent: "", blockType: "paragraph", isGroup: false }
            
            newBlocks.push(newBlock)
            newBlockId = newBlock.blockId
        } else if(block.isGroup === true && block.blockChildren !== undefined) {
            let output = appendNoteBlockRECURSE(block.blockChildren, blockId, createFocusRequest)
            block.blockChildren = output.blocks
            newBlocks[i] = block

            if(output.id !== undefined)
                newBlockId = output.id
        }
    }

    return { blocks: newBlocks, id: newBlockId }
}

export { 
    updateNoteBlockRECURSE,
    changeNoteBlockRECURSE,
    deleteNoteBlockRECURSE,
    appendNoteBlockRECURSE 
}