import { MutableRefObject, useCallback, useEffect, useState } from "react"
import { ILunarNote, ILunarProject } from "../state"
import { v4 } from "uuid"
import { INoteBlock } from "../../refresh-document/types"
import { IAuthenticationData } from "../../../data/user/types"
import { useRouter } from "next/router"
import { LunarRefreshAPI_updateNotes } from "../api"
import { showNotification } from "@mantine/notifications"

/**
 * @description
 *  - this is a hook meant to abstract away all the state relating to note's within the data-manager
 * 
 * @param lunarProject
 *  - the active project, changes percolate down from here
 * 
 * @function setNotes
 *  - this is the RAW function that set's the note's state
 * @function createNewNote
 *  - this is the function that handles the creation of a new note.
 * @function deleteNote
 *  - this is the function that handles the deletion of a note
 * @function editNoteName
 *  - this is the function that handles the editing of a note's name
 */
const useRefreshNoteData = (
    lunarProject: ILunarProject | undefined,
    dataLoad: MutableRefObject<Boolean>,
    authData: IAuthenticationData | null | undefined,
    setLunarProject: (project: ILunarProject | undefined) => void
) => {
    //theese are the notes in the project (detached for easier editing)
    const [notes, setNotes] = useState<ILunarNote[]>([])

    /**
     * NOTE: This function should only be used within the data context
     * 
     * @description
     *  - this is the function that handles the creation ofa new note within the data context.
     * @param name
     *  - this is the name for the new note
     * @param id
     *  - this is the fileId for the new note
     */
    const createNewNote = useCallback((name: string, id: string) => {
        let newNotes: ILunarNote[] = notes
        let newNote: ILunarNote = {
            name: name,
            objectId: id,
            blocks: []
        }

        newNote.blocks.push({ blockId: v4(), blockType: "paragraph", blockContent: "", isGroup: false })
        newNotes.push(newNote)
        setNotes([ ...newNotes ])
    }, [notes])

    /**
     * NOTE: This function should only be used within the data context
     * 
     * @description
     *  - this is the function that handles the deletion of a note within the data context
     * @param fileId
     *  - this is the id of the note we are going to delete
     */
    const deleteNote = useCallback((fileId: string) => {
        let newNotes: ILunarNote[] = []
        for(let i = 0; i < notes.length; i++) {
            let note = notes[i]
            if(note.objectId === fileId)
                continue

            newNotes.push(note)
        }

        setNotes([ ...notes ])
    }, [notes])

    /**
     * NOTE: This function should not be used outside o fthe data context
     * 
     * @description
     *  - this is the function that edit's a note's name
     * @param fileId
     *  - this is the id of the note we want to edit
     * @param name
     *  - this is the new name of the note
     */
    const editNoteName = useCallback((fileId: string, name: string) => {
        let newNotes: ILunarNote[] = []
        for(let i = 0; i < notes.length; i++) {
            let note = notes[i]
            if(note.objectId === fileId)
                note.name = name

            newNotes.push(note)
        }

        setNotes([ ...newNotes ])
    }, [notes])

    /**
     * @description
     *  - this is the function that updates the blocks in a note
     * @param fileId
     *  - this is the id of the file we are updating
     * @param newBlocks
     *  - these are the new blocks the note has to be updated with
     */
    const updateNoteBlocks = useCallback((fileId: string, newBlocks: INoteBlock[]) => {
        let newNotes: ILunarNote[] = []
        for(let i = 0; i < notes.length; i++) {
            let note = notes[i]
            if(note.objectId === fileId)
                note.blocks = newBlocks

            newNotes.push(note)
        }

        setNotes([ ...newNotes ])
    }, [notes])

    /**
     * @description
     *  - This is the function that retreives a note's blocks from the data manager
     * @param fileId
     *  - this is the id of the file we want the blocks for
     */
    const fetchNoteBlocks = useCallback((fileId: string) => {
        for(let i = 0; i < notes.length; i++) {
            let note_ = notes[i]
            if(note_.objectId === fileId)
                return note_.blocks   
        }

        return undefined
    }, [notes])

    const router = useRouter()

    //this is the effect that handles the updating of the notes
    useEffect(() => {
        async function main() {
            let token = authData?.token
            let lunarId = authData?.lunarId
            let query = router.query.ids

            if(query === undefined)
                return
            if(dataLoad.current === false || token === undefined || lunarId === undefined)
                return
            if(Array.isArray(query) === false || query.length !== 2)
                return

            const organizationId = query[0]
            const projectId = query[1]
            const result = await LunarRefreshAPI_updateNotes(token, lunarId, organizationId, projectId, notes)

            if(result !== undefined)
                showNotification({
                    title: "Update Error",
                    message: `There was an error updating the server. Error code: ${result}`,
                    color: 'red',
                    autoClose: 1000 * 5
                })
        }

        const timeout = setTimeout(() => main(), 15 * 1000)
        return () => clearTimeout(timeout)
    }, [notes, authData])

    return {
        notes,
        setNotes,
        createNewNote,
        deleteNote,
        editNoteName,
        fetchNoteBlocks,
        updateNoteBlocks
    }
}

export default useRefreshNoteData