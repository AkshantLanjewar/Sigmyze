import { useEffect, useState } from "react"
import { INoteBlock } from "../types"
import { ISigmyzeFile } from "../../../ui/file-management/types"

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
    updateNoteBlocks: (fileId: string, blocks: INoteBlock[]) => void
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

            newBlocks.push(block)
        }

        setBlocks([ ...newBlocks ])
        updateNoteBlocks(fileId, newBlocks)
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
        updateNoteBlock
    }
}

export default useNoteData