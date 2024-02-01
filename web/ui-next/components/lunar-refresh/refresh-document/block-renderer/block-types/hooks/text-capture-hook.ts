import { useCallback, useEffect, useRef, useState } from "react"
import { Blocks } from "../../../types"
import { IQuantaXYPos } from "../../../../../quanta/quanta-editor/types/nodes"
import useActionMenu from "./action-menu"

/**
 * @description
 *  - this is the function that captures the text events from the content editable
 * @param ref
 *  - this is the ref that is being captured from the content editable
 * @param active
 *  - this is whether or not the element is actively in editing mode
 * @param blockId
 *  - this is the id for this block
 * @param blockType
 *  - this is the current block type
 * @param focus
 *  - this is whether or not the block is focused
 * @param changeNoteBlock
 *  - This is the function that updates a note block
 * @param ignore
 *  - flag to set if we want the text capture hook to temporarily stop handling keyUp events
 */
const useTextCaptureHook = (
    ref: React.RefObject<HTMLElement>,
    active: boolean,
    blockId: string,
    blockType: Blocks,
    focus: boolean,
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,
    isHeading?: boolean
) => {
    const { menuActive, position, actionKeyDown, actionKeyUp } = useActionMenu(ref, focus)

    /**
     * @description
     *  - this is the function that handles the onKeyUp event
     * @param event
     *  - this is the data that is sent when the onkey up event is fired
     */
    const onKeyUp = (event: KeyboardEvent) => {
        if(ref.current === null)
            return

        //get the inner text value within the ref and check if the block value should be changed
        const text = ref.current.innerText
        switch(text) {
            case "#":
                changeNoteBlock(blockId, "heading::1", text)
                break
            //chart 
            case "@$":
                changeNoteBlock(blockId, "media::chart", "")
                break
            //image
            case "@#":
                changeNoteBlock(blockId, "media::image", "")
                break
            default:
                if(blockType === "paragraph")
                    return

                //the default case will be to make sure the block is a paragraph block
                changeNoteBlock(blockId, "paragraph", text)
                break
        }
    }

    

    //this is the effect that handles whenever the node is actively in editing mode
    useEffect(() => {
        if(ref.current === null)
            return

        ref.current.removeEventListener("keyup", onKeyUp)
        ref.current.removeEventListener("keydown", actionKeyDown)
        if(active === false)
            return

        //attach the handler that detectes the onkeydown
        ref.current.addEventListener("keydown", actionKeyDown)

        //we need to attach a handler that detects onKeyPress event
        if(menuActive === false)
            ref.current.addEventListener("keyup", onKeyUp)
        else
            ref.current.addEventListener("keyup", actionKeyUp)
    }, [active, menuActive])

    return {
        menuActive,
        position
    }
}

export default useTextCaptureHook