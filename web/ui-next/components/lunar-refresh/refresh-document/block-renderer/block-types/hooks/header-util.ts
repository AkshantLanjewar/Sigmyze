import { RefObject } from "react"

/**
 * @description
 *  - this is the helper function that determines wether or not the selection is at the beginning or the end of the container
 * @param ref
 *  - this is the ref for the container in question
 */
const getSelectionTextInfo = (ref: RefObject<HTMLDivElement>) => {
    if(ref.current === null)
        return { atStart: false, atEnd: false }

    let atStart = false, atEnd = false
    let selRange, testRange
    if(window.getSelection) {
        let sel = window.getSelection()
        if(sel !== null && sel.rangeCount) {
            selRange = sel.getRangeAt(0)
            testRange = selRange.cloneRange()

            testRange.selectNodeContents(ref.current)
            testRange.setEnd(selRange.startContainer, selRange.startOffset)
            atStart = (testRange.toString() === "")

            testRange.selectNodeContents(ref.current)
            testRange.setStart(selRange.endContainer, selRange.endOffset)
            atEnd = (testRange.toString() === "")
        }
    }

    return { atStart, atEnd }
}

export { getSelectionTextInfo }
