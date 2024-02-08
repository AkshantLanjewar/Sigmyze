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

    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        if(block.blockId === blockId && i > 0) {
            let parentBlock = { ...blocks[i - 1] }
            parentBlock.isGroup = true

            if(parentBlock.blockChildren === undefined)
                parentBlock.blockChildren = [block]
            else
                parentBlock.blockChildren.push(block)

            newBlocks[i - 1] = parentBlock
            newBlocks[i-1].isGroup = true
            focusId = block.blockId
        } else {
            if(block.isGroup === true && block.blockChildren !== undefined)
                block.blockChildren = groupNoteBlockRECURSE(block.blockChildren, blockId, createFocusRequest)

            newBlocks.push(block)
        }
    }

    if(focusId !== undefined)
        setTimeout(() => createFocusRequest(focusId!), 50)

    return newBlocks
}

interface IUngroupBlockRecurseOUT {
    newBlocks: INoteBlock[],
    index: number | undefined,
    ungroupId: string | undefined
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
): IUngroupBlockRecurseOUT => {
    let newBlocks: INoteBlock[] = []
    let ungroupIndex: number | undefined = undefined
    let ungroupId: string | undefined = undefined
    
    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        if(block.blockId === blockId) {
            ungroupIndex = i
            ungroupId = block.blockId

            continue
        }

        let postBlock: INoteBlock | undefined = undefined
        if(block.isGroup === true && block.blockChildren !== undefined) {
            const persistedChildren = [ ...block.blockChildren ]
            const output = ungroupBlockRECURSE(block.blockChildren, blockId, createFocusRequest, parentBlock)
            block.blockChildren = output.newBlocks

            if(output.index !== undefined) {
                postBlock = persistedChildren[output.index]

                //case if the block being ungrouped has children underneath it
                if(output.index < block.blockChildren.length) {
                    //swap the children
                    let nBlockChildren: INoteBlock[] = []
                    for(let x = 0; x < output.index; x++)
                        nBlockChildren.push(output.newBlocks[x])

                    let pBlockChildren: INoteBlock[] = []
                    for(let x = output.index; x < output.newBlocks.length; x++)
                        pBlockChildren.push(output.newBlocks[x])

                    if(nBlockChildren.length > 0) {
                        block.isGroup = true
                        block.blockChildren = nBlockChildren
                    } else {
                        block.isGroup = false
                        block.blockChildren = undefined
                    }

                    if(pBlockChildren.length > 0) {
                        postBlock.isGroup = true
                        postBlock.blockChildren = pBlockChildren
                    } else {
                        postBlock.isGroup = false
                        postBlock.blockChildren = undefined
                    }
                } else if(block.blockChildren.length === 0) {
                    block.isGroup = false
                    block.blockChildren = undefined
                }
            }

            if(output.ungroupId !== undefined)
                ungroupId = output.ungroupId
        }

        newBlocks.push(block)
        if(postBlock !== undefined)
            newBlocks.push(postBlock)
    }

    return { newBlocks, index: ungroupIndex, ungroupId }
}

export { 
    groupNoteBlockRECURSE,
    ungroupBlockRECURSE 
}