import { useEffect } from "react"

/**
 * @description
 *  - this is the hook that handles all the text based gestures such as grouping ungrouping and adding children
 * @param active 
 *  - this is whether or not the ref is active
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
 */
const useTextGestures = (
    active: boolean,
    blockId: string,
    editableRef: React.RefObject<HTMLElement>,
    groupNoteBlock: (blockId: string) => void,
    appendNoteBlock: (blockId: string) => void,
    ungroupNoteBlock: (blockId: string) => void
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
            default:
                return
        }
    }

    //effect that sets up the listeners
    useEffect(() => {
        if(active === false || editableRef.current === null)
            return

        editableRef.current.addEventListener("keydown", keyDown)
        return () => editableRef.current?.removeEventListener("keydown", keyDown)
    }, [active])
}

export default useTextGestures