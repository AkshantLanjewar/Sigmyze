import { useCallback, useEffect, useState } from "react"
import { Blocks, INoteBlock } from "../../types"
import { ISigmyzeFile } from "../../../../ui/file-management/types"
import { v4 } from "uuid"
import { appendNoteBlockRECURSE, changeNoteBlockRECURSE, deleteNoteBlockRECURSE, updateNoteBlockRECURSE } from "./update"
import { groupNoteBlockRECURSE, ungroupBlockRECURSE } from "./group"
import { createDisplayLayout } from "./focus"

const useNoteData = (
    /**
     * This is the id of the file this note belongs too
     */
    fileId: string,

    /**
     * The block that is active within the editor
     */
    activeBlock: string | undefined,

    /**
     * This is the function that retreives a file by its id
     */
    getFileById: (fileId: string) => ISigmyzeFile | undefined,

    /**
     * This is the function that edits a file's title within the UI
     */
    editFileTitle: (fileId: string, fileType: string, newTitle: string) => void,

    /**
     * This is the function that fetches the blocks from the data manager
     */
    fetchNoteBlocks: (fileId: string) => INoteBlock[] | undefined,

    /**
     * This is the function that updates the data manager blocks for a note file
     */
    updateNoteBlocks: (fileId: string, blocks: INoteBlock[]) => void,
    
    /**
     * This is the function that creates a focus request within the editor
     */
    createFocusRequest: (blockId: string) => void
) => {
    //these are the blocks that are to be rendered within the document editor
    const [blocks, setBlocks] = useState<INoteBlock[]>([])

    //stringified version of blocks due to react update sucks
    const [blocksSTR, setBlocksSTR] = useState<string>("[]")

    //whether or not the blocks have been updated
    const [blocksUpdated, setBlocksUpdated] = useState<boolean>(false)
    //function to toggle the blocks updated
    const toggleBlocksUpdated = () => setBlocksUpdated((step) => !step)

    //this is the current title of the note
    const [title, setTitle] = useState<string>("")

    /**
     * @description
     *  - this is the method that edits the title of the note
     * @param newTitle
     *  - this is the new title for the note
     */
    const changeNoteTitle = (newTitle: string) => {
        editFileTitle(fileId, "note", newTitle)
        setTitle(newTitle)
    }

    /**
     * @description
     *  - this is the function that updates the internal blocks with a block change
     *  - as well as updating the data context with the new info
     * @param blockId
     *  - this is the id of the block whos content we are updating
     * @param newContent
     *  - this is the content that the block is going to be updated with
     */
    const updateNoteBlock = (blockId: string, newContent: string) => {
        let newBlocks: INoteBlock[] = []
        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.blockId === blockId)
                block.blockContent = newContent
            if(block.isGroup === true && block.blockChildren !== undefined)
                block.blockChildren = updateNoteBlockRECURSE(block.blockChildren, blockId, newContent)

            newBlocks.push(block)
        }

        setBlocks([ ...newBlocks ])
        setBlocksSTR(JSON.stringify(newBlocks))
        updateNoteBlocks(fileId, newBlocks)
        toggleBlocksUpdated()
    }

    /**
     * @description
     *  - this is the function that switches a blocks type
     * @param blockId
     *  - this is the id of the block whos type we are switching
     * @param newType
     *  - this is the new type of the block
     * @param newContent
     *  - since we are updating the block mid render, we need to update the text as well
     */
    const changeNoteBlock = (blockId: string, newType: Blocks, newContent: string) => {
        let newBlocks: INoteBlock[] = []
        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.blockId === blockId) {
                block.blockType = newType
                block.blockContent = newContent
            } else if(block.isGroup && block.blockChildren !== undefined) {
                block.blockChildren = changeNoteBlockRECURSE(block.blockChildren, blockId, newType, newContent)
            }

            newBlocks.push(block)
        }

        setBlocks([ ...newBlocks ])
        setBlocksSTR(JSON.stringify(newBlocks))
        updateNoteBlocks(fileId, newBlocks)
        toggleBlocksUpdated()
        
        setTimeout(() => createFocusRequest(blockId!), 50)
    }

    /**
     * @description
     *  - this is the RAW function to create a new block
     * @param newType
     *  - this is the new type for the block
     */
    const createRawBlock = (newType: Blocks) => {
        let newBlocks = blocks
        newBlocks.push({
            blockId: v4(),
            blockType: "paragraph",
            blockContent: "",
            isGroup: false
        })

        setBlocks([ ...newBlocks ])
        setBlocksSTR(JSON.stringify(newBlocks))
        updateNoteBlocks(fileId, newBlocks)
        toggleBlocksUpdated()
    }

    /**
     * @description
     *  - this is the function that deletes a block from the editor
     * @param blockId
     *  - this is the id of the block we are trying to delete
     */
    const deleteNoteBlock = (blockId: string) => {
        const displayList = createDisplayLayout(blocks)
        let output = deleteNoteBlockRECURSE(blocks, blockId)
        if(output.focusId === undefined)
            return
        if(output.blocks.length === 0) {
            output.blocks.push({ blockId: v4(), blockContent: "", blockType: "paragraph", isGroup: false })
            displayList.push(output.blocks[0].blockId)
        }

        let index = displayList.indexOf(output.focusId)
        if(index === -1)
            return
        if(index > 0)
            index = index - 1
        else
            index = 1

        setBlocks([ ...output.blocks ])
        setBlocksSTR(JSON.stringify(output.blocks))
        updateNoteBlocks(fileId, output.blocks)
        toggleBlocksUpdated()

        setTimeout(() => createFocusRequest(displayList[index]), 50)
    }

    /**
     * @description
     *  - this is the function that groups a note block
     * @param blockId 
     *  - this is the id of the block that is groing to be grouped
     */
    const groupNoteBlock = (blockId: string) => {
        let newBlocks = groupNoteBlockRECURSE(blocks, blockId, createFocusRequest)

        setBlocks([ ...newBlocks ])
        setBlocksSTR(JSON.stringify(newBlocks))
        updateNoteBlocks(fileId, newBlocks)
        toggleBlocksUpdated()
    }

    /**
     * @description
     *  - this is the function that ungroups a note block
     * @param blockId 
     *  - this is the id of the block that is going to get ungrouped
     */
    const ungroupNoteBlock = (blockId: string) => {
        const persistedBlocks = [ ...blocks ]
        let { newBlocks, ungroupId } = ungroupBlockRECURSE(blocks, blockId, createFocusRequest)
        const nSTR = JSON.stringify(newBlocks)
        if(newBlocks.length < persistedBlocks.length)
            return
        
        setBlocks([ ...newBlocks ])
        setBlocksSTR(nSTR)
        updateNoteBlocks(fileId, newBlocks)
        toggleBlocksUpdated()

        if(ungroupId !== undefined)
            setTimeout(() => createFocusRequest(ungroupId!), 50)
    }

    /**
     * @description
     *  - this is the function that appends a new block after the specified blockid
     * @param blockId 
     *  - this is the block id of the block we want to add another block after
     */
    const appendNoteBlock = (blockId: string) => {
        let newBlocks = appendNoteBlockRECURSE(blocks, blockId, createFocusRequest)

        setBlocks([ ...newBlocks.blocks ])
        setBlocksSTR(JSON.stringify(newBlocks.blocks))
        updateNoteBlocks(fileId, newBlocks.blocks)
        toggleBlocksUpdated()

        createFocusRequest(newBlocks.id!)
    }

    /**
     * @description
     *  - this is the function that increments the focus up one block display wise
     */
    const incrementFocusUp = useCallback(() => {
        if(activeBlock === undefined)
            return

        let displayLayout = createDisplayLayout(blocks)
        const activeIndex = displayLayout.indexOf(activeBlock)
        if(activeIndex === -1)
            return //index not found error

        let newIndex = 0
        if(activeIndex === 0)
            newIndex = displayLayout.length - 1
        else
            newIndex = activeIndex - 1

        //create the focus request
        createFocusRequest(displayLayout[newIndex])
    }, [activeBlock, blocks, createFocusRequest])

    /**
     * @description
     *  - this is the function that decrements the focus down one block display wise
     */
    const decrementFocusDown = useCallback(() => {
        if(activeBlock === undefined)
            return

        let displayLayout = createDisplayLayout(blocks)
        const activeIndex = displayLayout.indexOf(activeBlock)
        if(activeIndex === -1)
            return //index not found error

        let newIndex = 0
        if(activeIndex === displayLayout.length - 1)
            newIndex = 0
        else
            newIndex = activeIndex + 1

        //create the focus request
        createFocusRequest(displayLayout[newIndex])
    }, [activeBlock, blocks, createFocusRequest])

    //this is the effect that loads in the initial data from the file
    useEffect(() => {
        let file = getFileById(fileId)
        let newBlocks = fetchNoteBlocks(fileId)
        if(file === undefined || newBlocks === undefined)
            return
        
        setTitle(file.fileName)
        setBlocks([ ...newBlocks ])
        setBlocksSTR(JSON.stringify(newBlocks))
        toggleBlocksUpdated()
    }, [fileId])

    return {
        blocks,
        title,
        blocksUpdated,
        blocksSTR,
        changeNoteTitle,
        updateNoteBlock,
        changeNoteBlock,
        createRawBlock,
        deleteNoteBlock,
        groupNoteBlock,
        ungroupNoteBlock,
        appendNoteBlock,
        incrementFocusUp,
        decrementFocusDown
    }
}

export default useNoteData