import { useEffect, useRef, useState } from "react"

/**
 * @description
 *  - this is the function that captures the text events from the content editable
 * @param ref
 *  - this is the ref that is being captured from the content editable
 * @param active
 *  - this is whether or not the element is actively in editing mode
 */
const useTextCaptureHook = (
    ref: React.RefObject<HTMLElement>,
    active: boolean
) => {
    //this is the keys that have been captured before space has been pressed
    const keyQueue = useRef<string[] | undefined>(undefined)

    //this is the ref that stores whether or not the first space has been pressed
    const firstSpace = useRef<boolean>(false)

    //this is whether or not the block can be in tracking mode
    const [track, setTrack] = useState<boolean>(false)

    //this is the toggle to flush the queue
    const [flush, setFlush] = useState<boolean>(false)

    //this is the effect that handles whenever the node is actively in editing mode
    useEffect(() => {
        if(active === false || ref.current === null)
            return
    }, [active])

    return {

    }
}

export default useTextCaptureHook