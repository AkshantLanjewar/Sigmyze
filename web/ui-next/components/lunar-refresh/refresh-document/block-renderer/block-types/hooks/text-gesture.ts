import { useEffect } from "react"

/**
 * @description
 *  - this is the hook that handles all the text based gestures such as grouping ungrouping and adding children
 * @param active 
 *  - this is whether or not the ref is active
 * @param menuActive
 *  - whether or not the context menu is active
 * @param blockId 
 *  - this is the id of the current block
 * @param editableRef 
 *  - this is the ref for the content editable div
 * @param groupNoteBlock
 *  - function that groups a note block
 * @param appendNoteBlock
 *  - this is the function that appends a note block
 * @param ungroupNoteBlock
 *  - this is the function tha tungroups a note block
 * @param incrementFocusUp
 *  - this is the function that moves the focus up one display block
 * @param decrementFocusDown
 *  - this is the function that moves the focus down one display block
 * @param deleteNoteBlock
 *  - this is the function that deletes a note block from the editor
 */
const useTextGestures = (
    active: boolean,
    blockId: string,
    menuActive: boolean,
    editableRef: React.RefObject<HTMLElement>,
    groupNoteBlock: (blockId: string) => void,
    appendNoteBlock: (blockId: string) => void,
    ungroupNoteBlock: (blockId: string) => void,
    incrementFocusUp: () => void,
    decrementFocusDown: () => void,
    deleteNoteBlock: (blockId: string) => void
) => {
    /**
     * @description
     *  - this is the function that handles the keyDown event
     * @param event 
     */
    const keyDown = (event: KeyboardEvent) => {
        switch(event.key) {
            case "Tab":
                event.preventDefault()

                if(event.shiftKey === false)
                    groupNoteBlock(blockId)
                else
                    ungroupNoteBlock(blockId)

                return
            case "Enter":
                event.preventDefault()
                appendNoteBlock(blockId)

                return
            case "ArrowUp":
                event.preventDefault()
                incrementFocusUp()

                return
            case "ArrowDown":
                event.preventDefault()
                decrementFocusDown()

                return
            case "Backspace":
                if(editableRef.current === null)
                    return
                if(editableRef.current.textContent === undefined || editableRef.current.textContent!.length > 0)
                    return

                //delete the block since it has nothign in it, other cases handled by function
                deleteNoteBlock(blockId)
                return
            default:
                return
        }
    }

    //effect that sets up the listeners
    useEffect(() => {
        if(active === false || editableRef.current === null || menuActive === true)
            return

        editableRef.current.addEventListener("keydown", keyDown)
        return () => editableRef.current?.removeEventListener("keydown", keyDown)
    }, [active, menuActive, blockId, incrementFocusUp, decrementFocusDown])
}

export default useTextGestures