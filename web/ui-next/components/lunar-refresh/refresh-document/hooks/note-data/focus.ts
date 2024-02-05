import { INoteBlock } from "../../types"

/**
 * @description
 *  - this is the recursive function that creates a display layout of the blockId's in display order accounting for groups
 * @param blocks 
 *  - the blocks we are to recurse through and create a display layout
 */
const createDisplayLayout = (blocks: INoteBlock[]) => {
    let displayIds: string[] = []
    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        displayIds.push(block.blockId)

        if(block.isGroup === true && block.blockChildren !== undefined) {
            let childrenIds = createDisplayLayout(block.blockChildren)
            for(let x = 0; x < childrenIds.length; x++)
                displayIds.push(childrenIds[x])
        }
    }

    return displayIds
}

export { createDisplayLayout }