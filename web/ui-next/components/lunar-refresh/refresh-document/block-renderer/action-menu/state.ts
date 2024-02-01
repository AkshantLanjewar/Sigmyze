import { P } from "@antv/g2plot"
import { useEffect, useRef, useState } from "react"
import { BLOCK_REGSITRY } from "../block-types"

/**
 * @description
 *  - this is the function that encapsulates all the state for the action menu component
 * @param menuOpen
 *  - whether or not the menu is open
 */
const useActionMenuState = (menuOpen: boolean) => {
    //this is the index of the active item within the menu
    const [active, setActive] = useState<number>(0)

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
    }, [menuOpen, active])

    //effect that focuses the menu item into view on the active change
    useEffect(() => {
        const ref = getRef(active)
        if(ref === null)
            return

        ref.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
    }, [active])
    
    return {
        active,
        trackRef
    }
}

export default useActionMenuState