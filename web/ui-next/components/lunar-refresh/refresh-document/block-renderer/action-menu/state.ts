import { P } from "@antv/g2plot"
import { useEffect, useRef, useState } from "react"
import { BLOCK_REGSITRY, IRegisteredNoteBlock } from "../block-types"
import { IQuantaXYPos } from "../../../../quanta/quanta-editor/types/nodes"
import { matchSorter } from 'match-sorter'
import { Blocks } from "../../types"

/**
 * @description
 *  - this is the function that encapsulates all the state for the action menu component
 * @param menuOpen
 *  - whether or not the menu is open
 * @param position
 *  - this is the position of the action menu, when this changes there is a change to the text being typed
 * @param getQueryText
 *  - this is the function that returns the current query text
 */
const useActionMenuState = (
    menuOpen: boolean, 
    position: IQuantaXYPos, 
    getQueryText: () => string | null,
    changeBlockType: (newType: Blocks) => void
) => {
    //this is the index of the active item within the menu
    const [active, setActive] = useState<number>(0)

    //these are the blocks to be displayed
    const [blocks, setBlocks] = useState<IRegisteredNoteBlock[]>(BLOCK_REGSITRY)

    //dictionary of refs we will use to focus elements into view on active change
    const refs = useRef<{[key: string]: HTMLDivElement | null}>({})

    /**
     * @description
     *  - this is the function that tracks a menu item ref
     * @param index 
     *  - this is the index of the menu item
     * @param ref 
     *  - this is the physical ref to store
     */
    const trackRef = (index: number, ref: HTMLDivElement | null) => {
        if(refs.current === null)
            return

        const key = `menu-item-${index}`
        refs.current[key] = ref
    }

    /**
     * @description
     *  - this is the function that retreives a menu item ref based on its index
     * @param index 
     *  - the index of the menu item
     */
    const getRef = (index: number): HTMLDivElement | null => {
        if(refs.current === null)
            return null

        const key = `menu-item-${index}`
        if(!Object.keys(refs.current).includes(key))
            return null

        return refs.current[key]
    }

    /**
     * @description
     *  - this is the function that handles the onkeydown event when the action menu is active
     * @param event 
     *  - this is the data from the keyboard event
     */
    const onKeyDown = (event: KeyboardEvent) => {
        if(menuOpen === false)
            return

        switch(event.key) {
            case "ArrowUp":
                if(active === 0)
                    setActive(BLOCK_REGSITRY.length - 1)
                else
                    setActive((step) => step - 1)    
            
                break
            case "ArrowDown":
                if(active === BLOCK_REGSITRY.length - 1)
                    setActive(0)
                else
                    setActive((step) => step + 1)    

                break
            case "Enter":
                //change the block type
                event.preventDefault()
                const newBlock = blocks[active]
                changeBlockType(newBlock.blockType)

                break
            default:
                return
        }
    }

    //effect that adds listeners when menuOpen is true
    useEffect(() => {
        document.removeEventListener("keydown", onKeyDown)
        if(menuOpen === false)
            return

        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [menuOpen, active, blocks])

    //effect that focuses the menu item into view on the active change
    useEffect(() => {
        const ref = getRef(active)
        if(ref === null)
            return

        ref.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
    }, [active])

    //effect that handles searching
    useEffect(() => {
        const query = getQueryText()
        if(query === null || query.length === 0) {
            setBlocks([ ...BLOCK_REGSITRY ])
            return
        }

        const matched = matchSorter(BLOCK_REGSITRY, query, { keys: ["blockType", "name"] })
        if(active > matched.length - 1)
            setActive(matched.length - 1)

        setBlocks([ ...matched ])
    }, [position, active])
    
    return {
        active,
        blocks,
        trackRef
    }
}

export default useActionMenuState