import { useEffect, useRef, useState } from "react"
import { INoteBlock } from "../../../types"
import { ConvertToFileExplorerData } from "../../../../../file-explorer/functions"

/**
 * @description
 *  - this is a hook that abstracts away all the core editing logic for a text block for simplicity
 * @param block
 *  - This is the block that is being rendered
 * @param hasRequest
 *  - whether or not there is a focus request within the editor
 * @param endblock
 *  - Whether or not it is the endblock
 *  * @param focus
 *  - this is the state that focuses that the hook subscribes to
 * @param editableRef
 *   - this is the ref that is being captured from the content editable
 * @param updateNoteBlock
 *  - This is the function that updates a blocks content
 * @param consumeFocusRequest
 *   - This is the function that consumes a focus request
 */
const useTextBlock = (
    block: INoteBlock,
    hasRequest: boolean,
    endblock: boolean,
    focus: boolean,
    editableRef: React.RefObject<HTMLElement>,
    updateNoteBlock: (blockId: string, newContent: string) => void,
    consumeFocusRequest: (blockId: string) => boolean,
    order?: number
) => {
    //focus bug flag one
    const focusFlagOne = useRef<boolean>(true)
    //focus bug flag two
    const focusFlagTwo = useRef<boolean>(true)

    //this is the internal buffer for all changes that need to be applied
    const [buffer, setBuffer] = useState<string | undefined | null>(undefined)

    //this is the switch to flush the buffer when it is done
    const [flush, setFlush] = useState<boolean>(false)

    //this is whether or not the block is focused, used to display things such as the grip handle
    const [active, setActive] = useState<boolean>(false)

    //whether or not to display the flavor text
    const [flavor, setFlavor] = useState<boolean>(false)

    //this is the effect that flushes the buffer and updates the block content
    useEffect(() => {
        let uploadContent = buffer
        if(uploadContent === undefined)
            return
        if(uploadContent === null)
            uploadContent = ""

        updateNoteBlock(block.blockId, uploadContent)
        setBuffer(undefined)
    }, [flush])

    //this is the effect that consumes a hasRequest effect
    useEffect(() => {
        if(editableRef.current === null)
            return
        if(consumeFocusRequest(block.blockId) === false)
            return

        editableRef.current.focus()
        editableRef.current.focus()

        //move selection to the end of the element
        const range = document.createRange()
        const selection = window.getSelection()

        range.setStart(editableRef.current, editableRef.current.childNodes.length)
        range.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(range)
    }, [block, hasRequest])

    //this is the effect that focuses the element
    useEffect(() => {
        if(editableRef.current === null)
            return
        if(focusFlagOne.current === true) {
            focusFlagOne.current = false
            return
        } else if (focusFlagTwo.current === true) {
            focusFlagTwo.current = false
            return
        }
        
        if(order !== undefined) {
            let prefix = ""
            for(let i = 0; i < order; i++)
                prefix += "#"

            prefix += " "
        }

        
        editableRef.current.focus()

        //move selection to the end of the element
        const range = document.createRange()
        const selection = window.getSelection()

        range.setStart(editableRef.current, editableRef.current.childNodes.length)
        range.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(range)
    }, [focus])

    //this is the effect that determines whether the flavor string should be displayed or the block content
    useEffect(() => {
        setFlavor(false)
        if(endblock === false || active === true || block.blockContent.length > 0)
            return

        setFlavor(true)
    }, [block, endblock, active])

    return {
        flush,
        active,
        flavor,
        setBuffer,
        setActive,
        setFlush
    }
}

export default useTextBlock