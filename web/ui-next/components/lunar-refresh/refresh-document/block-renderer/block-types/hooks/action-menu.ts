import { useEffect, useRef, useState } from "react"
import { IQuantaXYPos } from "../../../../../quanta/quanta-editor/types/types"

/**
 * @description
 *  - this is the hook that encapsulates all the logic needed for an action menu to be present
 * @param ref
 *  - this is the ref that is being captured from the content editable
 * @param focus
 *  - whether or not the block is focused
 */
const useActionMenu = (ref: React.RefObject<HTMLElement>, focus: boolean) => {
    //this is the persisted text before the action menu was invoked
    const persisted = useRef<string | null>(null)

    //this is the text that been typed into the action menu
    const text = useRef<string | null>(null)

    //this is whether or not the action menu is active
    const [menuActive, setMenuActive] = useState<boolean>(false)

    //this is the XY pos for the action menu
    const [position, setPosition] = useState<IQuantaXYPos>({ x: 0, y: 0 })

    //this is the toggle that handles the updating of the position coordinates
    const [getMenuPosition, setGetMenuPosition] = useState(false)
    //function to toggle the get menu position
    const toggleGetMenuPosition = () => setGetMenuPosition((step) => !step)

    /**
     * @description
     *  - this is the function that closes the action menu
     */
    const closeActionMenu = (skip?: boolean) => {
        if(persisted.current === null || ref.current === null)
            return

        if(skip !== true)
            ref.current.textContent = persisted.current
        
        text.current = null
        persisted.current = null
        setMenuActive(false)
    }

    /**
     * @description
     *  - this is the function that returns all the text nodes from a container
     * @param node
     *  - this is the node that we want the text nodes from
     */
    const getTextNodesIn = (node: Node): Node[] => {
        const textNodes: Node[] = []
        if(node.nodeType === 3)
            textNodes.push(node)
        else {
            const children = node.childNodes
            for(let i = 0; i < children.length; i++)
                textNodes.push(...getTextNodesIn(children[i]))
        }

        return textNodes
    }

    /**
     * @description
     *  - this is the function that handles the onKeyDown event
     * @param event 
     *  - this is the data that is sent when the onkeydown event is fired
     */
    const actionKeyDown = (event: KeyboardEvent) => {
        if(ref.current === null)
            return

        const text_ = ref.current.innerText
        if(event.key === "!") {
            //this is the event where we have the action menu, we need to disable the monitoring and persist the text
            persisted.current = text_

            text.current = ""
            setMenuActive(true)
            toggleGetMenuPosition()
        }

        if(text.current !== null && (event.key === "ArrowUp" || event.key === "ArrowDown"))
            event.preventDefault()
    }

    /**
     * @description
     *  - this is the function that handles the onkeyup event when the action menu is active
     * @param event
     *  - this is the data that is sent when the onkey up event is fired
     */
    const actionKeyUp = (event: KeyboardEvent) => {
        if(ref.current === null || text.current === null)
            return
        
        //letter key was pressed, add it to the search parameters
        if(event.code === `Key${event.key.toUpperCase()}`) {
            text.current = `${text.current}${event.key}`
            toggleGetMenuPosition()
        } else if(event.key === "Backspace") {
            let cText = text.current
            if(cText.length === 0) {
                closeActionMenu()
                return
            }

            cText = cText.slice(0, -1)
            text.current = cText
            toggleGetMenuPosition()
        } else if(event.key === "Escape") {
            closeActionMenu(true)
            return
        }
    }

    //this is the effect that handles retreiving the menu position
    useEffect(() => {
        if(menuActive === false || ref.current === null)
            return

        let x = 0, y = 0
        if(typeof window.getSelection !== "undefined") {
            const selection = window.getSelection()
            if(selection?.rangeCount !== 0) {
                const range = selection?.getRangeAt(0).cloneRange()
                range?.collapse(true)
                const rect = range?.getClientRects()[0]

                if(rect !== undefined) {
                    x = rect.left
                    y = rect.top
                }
            }
        }

        setPosition({ x, y })
    }, [getMenuPosition])

    //effect that handles closing the action menu on focus loss
    useEffect(() => {
        if(focus === true)
            return

        closeActionMenu()
    }, [focus])

    //effect that toggles caret position when the menu becomes active
    useEffect(() => {
        if(menuActive === false)
            return

        toggleGetMenuPosition()
    }, [menuActive])
    
    return {
        menuActive,
        position,
        actionKeyDown,
        actionKeyUp
    }
}

export default useActionMenu