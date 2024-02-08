import { MediaValues } from "../../topbar/text-selector/transform"
import { Blocks, IBlockStyles, INoteBlock } from "../../types"

/*
 * @description
 *  - this is the function that generates the default styles for a block based on its type
 * @param blockType  
 *  - this is the type of the block we are generating the default styles for 
 */
const generateDefaultStyles = (blockType: Blocks) => {
    let defaultStyles: IBlockStyles = {
        bold: false,
        italic: false,
        strikethru: false,
        align: "left"
    }

    if(MediaValues.includes(blockType))
        defaultStyles.align = "center"

    return defaultStyles
}

/*
 * @description
 *  - this is the function that handles retreiving the block styles
 *  - if there are no styles attached to the block, then the default ones will be generated 
 * @param blocks 
 *  - these are the blocks the function will recurse through
 * @param blockId
 *  - this is the block id of the block we want styles for 
 */
const getBlockStylesRecurse = (blocks: INoteBlock[], blockId: string): IBlockStyles | undefined => {
    for(let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        if(block.blockId === blockId) {
            let styles = block.blockStyles
            if(styles !== undefined)
                return styles
            else
                return generateDefaultStyles(block.blockType)
        }

        if(block.isGroup === true && block.blockChildren !== undefined) {
            let blockChildren = block.blockChildren
            let style = getBlockStylesRecurse(blockChildren, blockId)
            if(style !== undefined)
                return style
        }
    }

    return undefined
}

/*
 * @description
 *  - this is the function that handles the setting of a specific block with updated styles 
 * @param blocks 
 *  - these are the blocks the function is going to recurse through 
 * @param blockId 
 *  - the request block 
 * @param styles 
 *  - the new styles for the block 
 */
const setBlockStylesRecurse = (blocks: INoteBlock[], blockId: string, styles: IBlockStyles) => {
    let newBlocks: INoteBlock[] = []
    for(let i = 0; i < blocks.length; i++) {
        let block = blocks[i]
        if(block.blockId === blockId)
            block.blockStyles = styles
        if(block.isGroup === false && block.blockChildren !== undefined)
            block.blockChildren = setBlockStylesRecurse(block.blockChildren, blockId, styles)

        newBlocks.push(block)
    }

    return newBlocks
}

export {
    getBlockStylesRecurse,
    setBlockStylesRecurse
}
