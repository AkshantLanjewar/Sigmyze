import { INoteBlock } from "../../types"

/**
 * @description
 *  - this is the recursive function that groups a block within the editor
 * @param blocks 
 *  - these are the blocks that we are recursing through
 * @param blockId 
 *  - this is the block id of the block that is being grouped
 * @param createFocusRequest 
 *  - function to create a focus request within the editor
 */
const groupNoteBlockRECURSE = (
    blocks: INoteBlock[],
    blockId: string,
    createFocusRequest: (blockId: string) => void
) => {
    let newBlocks: INoteBlock[] = []
    let focusId: string | undefined = undefined

    if(blocks.length === 1)
        return blocks
    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        if(block.blockId === blockId && i > 0) {
            let parentBlock = { ...blocks[i - 1] }
            parentBlock.isGroup = true
            parentBlock.blockChildren = [block]


            newBlocks[i - 1] = parentBlock
            newBlocks[i-1].isGroup = true
            focusId = block.blockId
        } else {
            newBlocks.push(block)
        }
    }

    if(focusId !== undefined)
        setTimeout(() => createFocusRequest(focusId!), 50)

    return newBlocks
}

/**
 * @description
 *  - this is the recursive function that ungroups a block within the editor
 * @param blocks 
 *  - these are the blocks that we are recursing through
 * @param blockId 
 *  - this is the block id of the block that is being grouped
 * @param createFocusRequest 
 *  - function to create a focus request within the editor
 */
const ungroupBlockRECURSE = (
    blocks: INoteBlock[],
    blockId: string,
    createFocusRequest: (blockId: string) => void,
    parentBlock?: INoteBlock
) => {
    let newBlocks: INoteBlock[] = []
    let ungroupIndex: number | undefined = undefined
    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        if(block.blockId === blockId && parentBlock !== undefined) {
            ungroupIndex = i
            setTimeout(() => createFocusRequest(block.blockId), 50)

            continue
        } else if(block.isGroup && block.blockChildren !== undefined) {
            let recurseOutput = ungroupBlockRECURSE(block.blockChildren, blockId, createFocusRequest, block)
            let persistedChildren = [ ...block.blockChildren ]
            block.blockChildren = recurseOutput.newBlocks

            newBlocks.push(block)
            if(recurseOutput.index !== undefined)
                newBlocks.push(persistedChildren[recurseOutput.index])
        }

        newBlocks.push(block)
    }

    return { newBlocks, index: ungroupIndex }
}

export { 
    groupNoteBlockRECURSE,
    ungroupBlockRECURSE 
}