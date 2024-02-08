import { Blocks, INoteBlock } from "../../types"

/*
 * This is the function that gets a block's type 
 * @param blockId 
 *  - the id of the requested block 
 * @param blocks 
 *  - the blocks to recurse through 
 */
const getBlockType = (blockId: string, blocks: INoteBlock[]): Blocks | undefined => {
    for(let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        if(block.blockId === blockId)
            return block.blockType

        if(block.isGroup === true && block.blockChildren !== undefined) {
            let res = getBlockType(blockId, block.blockChildren)
            if(res !== undefined)
                return res 
        }
    }

    return undefined
}

export { getBlockType }
