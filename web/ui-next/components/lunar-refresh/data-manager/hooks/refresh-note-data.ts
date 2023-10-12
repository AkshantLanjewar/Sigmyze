import { useCallback, useState } from "react"
import { ILunarNote } from "../state"

/**
 * @description
 *  - this is a hook meant to abstract away all the state relating to note's within the data-manager
 * 
 * @function setNotes
 *  - this is the RAW function that set's the note's state
 * @function createNewNote
 *  - this is the function that handles the creation of a new note.
 * @function deleteNote
 *  - this is the function that handles the deletion of a note
 */
const useRefreshNoteData = () => {
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
        const newNote: ILunarNote = {
            name: name,
            objectId: id
        }

        setNotes([ ...notes, newNote ])
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

        setNotes([ ...newNotes ])
    }, [notes])

    return {
        notes,
        setNotes,
        createNewNote,
        deleteNote
    }
}

export default useRefreshNoteData