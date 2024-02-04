import { useEffect, useState } from "react"
import { Blocks, INoteBlock } from "../../types"
import { ISigmyzeFile } from "../../../../ui/file-management/types"
import { v4 } from "uuid"
import { appendNoteBlockRECURSE, changeNoteBlockRECURSE, deleteNoteBlockRECURSE, updateNoteBlockRECURSE } from "./update"
import { groupNoteBlockRECURSE, ungroupBlockRECURSE } from "./group"

const useNoteData = (
    /**
     * This is the id of the file this note belongs too
     */
    fileId: string,

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
        updateNoteBlocks(fileId, newBlocks)
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
        updateNoteBlocks(fileId, newBlocks)
        setTimeout(() => createFocusRequest(blockId), 50)
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
        updateNoteBlocks(fileId, newBlocks)
    }

    /**
     * @description
     *  - this is the function that deletes a block from the editor
     * @param blockId
     *  - this is the id of the block we are trying to delete
     */
    const deleteNoteBlock = (blockId: string) => {
        let newBlocks: INoteBlock[] = []
        let deleteIndex: number | undefined = undefined
        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.blockId === blockId) {
                if(block.isGroup && block.blockChildren !== undefined) {
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

        if(deleteIndex !== undefined && newBlocks.length - 1 < deleteIndex && deleteIndex !== 0)
            deleteIndex = deleteIndex - 1
        if(newBlocks.length === 0)
            newBlocks.push({ blockId: v4(), blockType: "paragraph", blockContent: "", isGroup: false })

        setBlocks([ ...newBlocks ])
        updateNoteBlocks(fileId, newBlocks)
        if(deleteIndex !== undefined)
            createFocusRequest(newBlocks[deleteIndex].blockId)
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
        updateNoteBlocks(fileId, newBlocks)
    }

    /**
     * @description
     *  - this is the function that ungroups a note block
     * @param blockId 
     *  - this is the id of the block that is going to get ungrouped
     */
    const ungroupNoteBlock = (blockId: string) => {
        let { newBlocks, index } = ungroupBlockRECURSE(blocks, blockId, createFocusRequest)
        
        setBlocks([ ...newBlocks ])
        updateNoteBlocks(fileId, newBlocks)
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
        updateNoteBlocks(fileId, newBlocks.blocks)
        if(newBlocks.id !== undefined)
            setTimeout(() => createFocusRequest(newBlocks.id!), 25)
    }

    //this is the effect that loads in the initial data from the file
    useEffect(() => {
        let file = getFileById(fileId)
        let newBlocks = fetchNoteBlocks(fileId)
        if(file === undefined || newBlocks === undefined)
            return
        
        setTitle(file.fileName)
        setBlocks([ ...newBlocks ])
    }, [fileId])

    return {
        blocks,
        title,
        changeNoteTitle,
        updateNoteBlock,
        changeNoteBlock,
        createRawBlock,
        deleteNoteBlock,
        groupNoteBlock,
        ungroupNoteBlock,
        appendNoteBlock
    }
}

export default useNoteData