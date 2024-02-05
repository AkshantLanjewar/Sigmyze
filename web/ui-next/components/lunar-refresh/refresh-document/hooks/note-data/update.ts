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
 * This is the definition for the output for the deleteNoteBlockRECURSE function
 */
interface IDeleteNoteBlockRecurseOutput {
    /**
     * This is the list of blocks after the deleteNote function has been run through them recursively
     */
    blocks: INoteBlock[],

    /**
     * if a block was found to be deleted, this is the id of the block that was deleted
     */
    focusId: string | undefined
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
): IDeleteNoteBlockRecurseOutput => {
    let newBlocks: INoteBlock[] = []
    let focusId: string | undefined = undefined

    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        if(block.blockId === blockId) {
            if(block.isGroup === true && block.blockChildren !== undefined && i > 0) {
                let parentBlock = newBlocks[i - 1]
                if(parentBlock.isGroup === true && parentBlock.blockChildren !== undefined)
                    parentBlock.blockChildren.concat(block.blockChildren)
                else {
                    parentBlock.isGroup = true
                    parentBlock.blockChildren = block.blockChildren
                }

                newBlocks[i - 1] = parentBlock
            } else if(block.isGroup === true && block.blockChildren !== undefined && i === 0) {
                const blockChildren = block.blockChildren
                newBlocks.concat(blockChildren)
            }

            focusId = block.blockId
            continue
        } else if(block.isGroup === true && block.blockChildren !== undefined) {
            const output = deleteNoteBlockRECURSE(block.blockChildren, blockId)
            if(output.blocks.length === 0) {
                block.isGroup = false
                block.blockChildren = undefined
            } 

            block.blockChildren = output.blocks
            if(output.focusId !== undefined)
                focusId = output.focusId
        }

        newBlocks.push(block)
    }

    return { blocks: newBlocks, focusId }
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
            let newBlock: INoteBlock = { blockId: v4(), blockContent: "", blockType: "paragraph", isGroup: false }
            if(block.isGroup === true && block.blockChildren !== undefined) {
                block.isGroup = false
                newBlock.isGroup = true
                newBlock.blockChildren = block.blockChildren

                block.blockChildren = undefined
                newBlocks[i] = block
            }
            
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