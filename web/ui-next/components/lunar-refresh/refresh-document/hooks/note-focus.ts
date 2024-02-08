import { useRef, useState } from "react"

/**
 * @description
 *  - this is the hook that handles block focus within a note
 */
const useNoteFocus = () => {
    //this is the block that is requested to be focused
    const focusRequest = useRef<string | undefined>(undefined)

    //state whether or not there is a focus request that needs to be processed
    const [hasRequest, setHasRequest] = useState<boolean>(false)
    //function to toggle focus request
    const toggleHasRequest = () => setHasRequest(!hasRequest)

    //this is the active block within the editor, state is set by the active blocks themselves
    const [activeBlock, setActiveBlock] = useState<string | undefined>(undefined)

    /**
     * @description
     *  - this is the function that creates a focus request
     * @param blockId
     *  - this is the id of the block that we want to be focused
     */
    const createFocusRequest = (blockId: string) => {
        focusRequest.current = blockId
        toggleHasRequest()
    }

    /**
     * @description
     *  - this is the function that consumes a focus request based on the request block id
     *  - if the block id matches the request, then it returns true and resets the request
     * @param blockId 
     *  - this is the id of the requesting block
     */
    const consumeFocusRequest = (blockId: string) => {
        if(focusRequest.current !== blockId)
            return false

        focusRequest.current = undefined
        return true
    }

    const setActiveBlockState = (blockId: string) =>
        setActiveBlock(blockId)
    

    return {
        hasRequest,
        activeBlock,
        consumeFocusRequest,
        createFocusRequest,
        setActiveBlockState
    }
}

export default useNoteFocus