import { useCallback, useEffect, useRef, useState } from "react"
import { Blocks, INoteBlock } from "../../../types"
import { setUncaughtExceptionCaptureCallback } from "process"

/**
 * @description
 *  - this is the hook that encapsulates all the state needed for the header
 * @param block
 *  - this is the active block that is being rendered
 */
const useHeader = (
    block: INoteBlock,
    hasRequest: boolean,
    consumeFocusRequest: (blockId: string) => boolean,
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,
    updateNoteBlock: (blockId: string, newContent: string) => void
) => {
    //this is the ref for the ticks
    const tickRef = useRef<HTMLDivElement>(null)
    //this is the ref for the title
    const titleRef = useRef<HTMLDivElement>(null)
    //focus query on whether or not to activate the tickFocus
    const tickFocusQuery = useRef<boolean>(false)
    //ref to stop the focus bug
    const focusBug = useRef<boolean>(false)
    //initial mount for focused hook
    const initialMount = useRef<number>(0)
    //title focus bug
    const titleFocusBug = useRef<boolean>(false)
    //order ref for update
    const orderRef = useRef<number>(1)

    //this is the tick section of the header
    const [ticks, setTicks] = useState<string | undefined>(undefined)
    //flag to focus the tick
    const [focusTick, setFocusTick] = useState<boolean>(false)

    //this is the title section of the header
    const [title, setTitle] = useState<string | undefined>(undefined)
    //this is whether or not the title should be in content editable mode, used for a bug
    const [titleEdit, setTitleEdit] = useState<boolean>(true)
    //flag to reset title edit
    const [resetT, setResetT] = useState<boolean>(false)
    //flag to focus the title
    const [focusT, setFocusT] = useState<boolean>(false)

    //this is the active element within the header
    const [active, setActive] = useState<'tick' | 'title' | undefined>(undefined)

    //whether or not the element is focused
    const [focused, setFocused] = useState<boolean>(false)

    //this is the calculated order
    const [cOrder, setCOrder] = useState<number>(1)

    const setTicksActive = () => {
        if(titleRef.current === null)
            return

        titleRef.current.blur()
        setFocusTick(!focusTick)
        setActive('tick')
    }

    const focusHandler = () => {
        setFocused(true)
        setActive('title')

        if(title === undefined)
            setTicksActive()
    }

    const blurHandler = () => {
        if(tickRef.current === null || titleRef.current === null)
            return

        setFocused(false)
        setTitleEdit(false)
        setActive(undefined)

        focusBug.current = true
        tickRef.current.blur()
        titleRef.current.blur()
        setResetT(!resetT)
    }

    //this is the effect that consumes a focus request
    useEffect(() => {
        if(consumeFocusRequest(block.blockId) === false)
            return

        focusHandler()
    }, [hasRequest])

    //this is the effect that handles the block change to update values
    useEffect(() => {
        let type = block.blockType
        let typeSplit = type.split("::")
        if(typeSplit.length < 2)
            return

        setCOrder(parseInt(typeSplit[1]))
        let content = block.blockContent
        let split = content.split(" ")

        if(split.length < 2) {
            setTitle(undefined)
            setTicks(split[0])
        } else {
            setTicks(split[0])
            setTitle(split[1])
        }
    }, [block])

    //effect that runs reset toggle
    useEffect(() => {
        setTitleEdit(true)
    }, [resetT])

    const keyDownListener = (event: KeyboardEvent) => {
        if(titleRef.current === null || tickRef.current === null)
            return

        if(event.code === "Space") {
            event.preventDefault()

            const pTitle = titleRef.current.innerText
            if(pTitle.length === 0)
                setTitle("")                

            tickRef.current?.blur()

            let newType = `heading::${orderRef.current}` as Blocks
            const text = tickRef.current.innerText
            changeNoteBlock(block.blockId, newType, `${text} ${pTitle}`)
            
            titleFocusBug.current = true
            setActive('title')
            setFocusT((val) => !val)
        }
    }

    const keyUpListener = (event: KeyboardEvent) => {
        if(tickRef.current === null || titleRef.current === null)
            return

        if((event.code === "Backspace" || event.code === "ArrowLeft") && active === "title") {
            const titleText = titleRef.current.innerText
            if(titleText.length > 0)
                return

            
            titleRef.current.blur()

            setActive('tick')
            setFocusTick((val) => !val)
        }
        
        const text = tickRef.current.innerText
        if(text.length === 0 || active !== "tick")
            return

        switch(text) {
            case "#":
                setCOrder(1)
                orderRef.current = 1

                break
            case "##":
                setCOrder(2)
                orderRef.current = 2

                break
            case "###":
                setCOrder(3)
                orderRef.current = 3

                break
            case "####":
                setCOrder(4)
                orderRef.current = 4

                break
            case "#####":
                setCOrder(5)
                orderRef.current = 5

                break
            case "######":
                setCOrder(6)
                orderRef.current = 6

                break
            default:
                changeNoteBlock(block.blockId, "paragraph", text)
                break
        }
    }

    //this is the effect that sets the keyListeners based on the active item
    useEffect(() => {
        if(tickRef.current === null || titleRef.current === null)
            return

        if(focused === false) {
            tickRef.current?.removeEventListener("keydown", keyDownListener)
            tickRef.current.removeEventListener("keyup", keyUpListener)

            titleRef.current.removeEventListener("keyup", keyUpListener)
        } else {
            tickRef.current.addEventListener("keydown", keyDownListener)
            tickRef.current.addEventListener("keyup", keyUpListener)

            titleRef.current.addEventListener("keyup", keyUpListener)
        }
    }, [focused])

    //effect to focus t 
    useEffect(() => {
        if(titleRef.current === null || titleFocusBug.current === false)
            return

        titleFocusBug.current = false
        titleRef.current.focus()
        const range = document.createRange()
        const selection = window.getSelection()

        range.setStart(titleRef.current, titleRef.current.childNodes.length)
        range.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(range)
    }, [focusT])

    //effect to focus tick
    useEffect(() => {
        if(tickRef.current === null)
            return

        tickRef.current.focus()
        const range = document.createRange()
        const selection = window.getSelection()

        range.setStart(tickRef.current, tickRef.current.childNodes.length)
        range.collapse(true)
        selection?.removeAllRanges()
        selection?.addRange(range)
    }, [focusTick])

    //this is the effect that fires so that the state updates on focus end
    useEffect(() => {
        if(focused === true)
            return
        if(initialMount.current < 2) {
            initialMount.current += 1
            return
        }

        //check if the refs are null and return
        if(tickRef.current === null || titleRef.current === null)
            return

        const tickText = tickRef.current.innerText
        if(tickText.length === 0)
            return

        let titleText: string | undefined = titleRef.current.innerText
        if(titleText.length === 0)
            titleText = undefined

        setTicks(tickText)
        setTitle(titleText)
        updateNoteBlock(block.blockId, `${tickText} ${titleText}`)
    }, [focused])

    return {
        title,
        ticks,
        focused,
        tickRef,
        titleRef,
        titleEdit,
        cOrder,
        focusHandler,
        blurHandler,
        setTicksActive
    }
}

export default useHeader