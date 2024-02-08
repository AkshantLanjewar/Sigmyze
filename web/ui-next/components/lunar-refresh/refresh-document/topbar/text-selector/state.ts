import { useEffect, useState } from "react"
import { BLOCK_REGSITRY, IRegisteredNoteBlock } from "../../block-renderer/block-types"
import { Blocks, INoteBlock } from "../../types"
import { headingToParagraph, HeadingValues, mediaToHeading, mediaToParagraph, MediaValues, paragraphToHeading, textToMedia, TextValues } from "./transform"

/**
 * @description
 *  - this is the function that recursively searches through the blocks for the active block 
 * @param blocks
 *  - these are the blocks for the function to recurse through
 * @param blockId
 *  - this is the blockId of the block we are looking for
 */
const getActiveBlockRecurse = (blocks: INoteBlock[], blockId: string): INoteBlock | undefined => {
    for(let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        if(block.blockId === blockId)
            return block

        if(block.isGroup === true && block.blockChildren !== undefined) {
            const pBlock = getActiveBlockRecurse(block.blockChildren, blockId)
            if(pBlock !== undefined)
                return pBlock
        }
    }

    return undefined
}

/**
 * @description
 *  - this is the function that encapsulates all the required state for the dropdown component
 * @param activeBlock
 *  - this is the active block within the editor
 * @param editorBlocks
 *  - these are all the current blocks within the editor
 * @param changeNoteBlock
 *  - this is the function that changes a note block
 */
const useTextSelector = (
    activeBlock: string | undefined, 
    editorBlocks: INoteBlock[],
    changeNoteBlock: (blockId: string, newTypes: Blocks, newContent: string) => void
) => {
    //this is the active block within the editor and the toolbar
    const [active, setActive] = useState<IRegisteredNoteBlock | undefined>(undefined)

    //whether or not a block has been loaded 
    const [loaded, setLoaded] = useState<boolean>(false)

    //these are all the blocks that are going to be rendered within the toolbarswitch
    const [blocks, _setBlocks] = useState<IRegisteredNoteBlock[]>(BLOCK_REGSITRY)

    /**
    * @description
    *  - this is the function that transform the active block into the requsted block
    * @param desiredType
    *  - this is the desired type for the new block
    */
    const transformActiveBlock = (desiredType: Blocks) => {
        if(active === undefined || activeBlock === undefined)
            return

        let block: INoteBlock | undefined = undefined
        for(let i = 0; i < editorBlocks.length; i++) {
            const block_ = editorBlocks[i]
            if(block_.blockId === activeBlock)
                block = block_
        }

        let newBlock: INoteBlock | undefined = undefined
        if(block === undefined)
            return
        
        if(block.blockType === "paragraph" && HeadingValues.includes(desiredType)) //handles the case of paragraph to heading
            newBlock = paragraphToHeading(block, desiredType)
        else if(HeadingValues.includes(block.blockType) && desiredType === "paragraph") //handles heading to paragraph
            newBlock = headingToParagraph(block, desiredType)
        else if(TextValues.includes(block.blockType) && MediaValues.includes(desiredType)) //handles the conversion of text to media 
            newBlock = textToMedia(block, desiredType)
        else if(MediaValues.includes(block.blockType) && desiredType === "paragraph") //handles the case of media to paragraph 
            newBlock = mediaToParagraph(block, desiredType)
        else if(MediaValues.includes(block.blockType) && HeadingValues.includes(desiredType)) //handles the case of media to heading 
            newBlock = mediaToHeading(block, desiredType)
        if(newBlock === undefined) //if no block return
            return
        
        changeNoteBlock(activeBlock, newBlock.blockType, newBlock.blockContent)
    }

    //this is the effect to handle the loading of the active block
    useEffect(() => {
        if(activeBlock === undefined || editorBlocks.length === 0)
            return
        
        const block = getActiveBlockRecurse(editorBlocks, activeBlock)
        if(block === undefined)
            return

        let rBlock: IRegisteredNoteBlock | undefined = undefined
        for(let i = 0; i < BLOCK_REGSITRY.length; i++) {
            const _block = BLOCK_REGSITRY[i]
            if(_block.blockType === block.blockType)
                rBlock = _block
        }

        if(rBlock === undefined)
            return

        setActive({ ...rBlock })
        setLoaded(true)
    }, [activeBlock, editorBlocks])

    return {
        active,
        menuBlocks: blocks,
        loading: !loaded,
        transformActiveBlock
    }
}

export { useTextSelector }
