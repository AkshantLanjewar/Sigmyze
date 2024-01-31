import { useCallback, useEffect, useRef, useState } from "react"
import { Blocks } from "../../../types"

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
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,
    isHeading?: boolean
) => {
    /**
     * @description
     *  - this is a subroutine that detects whether or not the first space has been pressed
     * @returns
     *  - this returns a boolean where true meaning a space is detected, a.k.a terminate or false to continue
     */
    const detectFirstSpace = useCallback(() => {
        if(ref.current === null)
            return true

        //get the inner text value within the ref
        const text = ref.current.innerText
        const textSplit = text.split('')

        //now loop through and check if there has been a space that has been pressed
        for(let i = 0; i < textSplit.length; i++) {
            let character = textSplit[i]
            if(/\s/.test(character))
                return true
        }

        return false
    }, [])

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
        ref.current?.removeEventListener("keyup", onKeyUp)
        if(active === false || ref.current === null)
            return

        //we need to attach a handler that detects onKeyPress event
        ref.current.addEventListener("keyup", onKeyUp)
    }, [active])

    return {}
}

export default useTextCaptureHook