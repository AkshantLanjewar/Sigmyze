import { useEffect, useState } from "react"
import { IBlockStyles } from "../types"

const useTopbarState = (
    /*
     * This is the block whos styles we are using
     */
    activeBlock: string | undefined,

    /*
     * Whether or not the styles have been updated 
     */
    stylesUpdated: boolean,

    /*
     * This is the function that retreives the requested blocks styles 
     */
    getBlockStyles: (blockId: string) => IBlockStyles | undefined,

    /*
     * This is the function that sets the block styles 
     */
    setBlockStyles: (blockId: string, styles: IBlockStyles) => void
) => {
    //whether or not the bold is active
    const [bold, setBold] = useState<boolean>(false)

    //whether or not the italic is active 
    const [italic, setItalic] = useState<boolean>(false)

    //whether or not the strikethru is active 
    const [strike, setStrike] = useState<boolean>(false)

    //what position the align is in
    const [align, setAlign] = useState<'left' | 'center' | 'right' | 'justified'>('left')

    //this is the effect that handles the retreiving the block styles when the styles are updated 
    useEffect(() => {
        if(activeBlock === undefined)
            return

        let styles = getBlockStyles(activeBlock)
        if(styles === undefined || styles === null)
            return

        setBold(styles.bold)
        setItalic(styles.italic)
        setStrike(styles.strikethru)
        setAlign(styles.align)
    }, [activeBlock, stylesUpdated])

    /*
     * This is the function that handles bolding a block 
     */
    const toggleBoldOn = () => {
        if(activeBlock === undefined || bold === true)
            return

        setBlockStyles(activeBlock, { bold: true, italic, strikethru: strike, align })
    }

    /*
     * This is the function that handles un-bolding a block 
     */
    const toggleBoldOff = () => {
        if(activeBlock === undefined || bold === false)
            return
        
        setBlockStyles(activeBlock, { bold: false, italic, strikethru: strike, align })
    }

    /*
     * This is the function that handles italicizing a block 
     */
    const toggleItalicOn = () => {
        if(activeBlock === undefined || italic === true)
            return 

        setBlockStyles(activeBlock, { bold, italic: true, strikethru: strike, align })
    }

    /*
     * This is the function that handles un-italicizing a block 
     */
    const toggleItalicOff = () => {
        if(activeBlock === undefined || italic === false)
            return 

        setBlockStyles(activeBlock, { bold, italic: false, strikethru: strike, align })
    }

    /*
     * This is the function that handles making a block striked thru  
     */
    const toggleStrikethruOn = () => {
        if(activeBlock === undefined || strike === true)
            return

        setBlockStyles(activeBlock, { bold, italic, strikethru: true, align })
    }

    /*
     * This is the function that handles making a block un-striked thru  
     */
    const toggleStrikethruOff = () => {
        if(activeBlock === undefined || strike === false)
            return

        setBlockStyles(activeBlock, { bold, italic, strikethru: false, align })
    }

    const updateAlign = (alignRequest: 'left' | 'center' | 'right' | 'justified') => {
        if(activeBlock === undefined || align === alignRequest)
            return 

        setBlockStyles(activeBlock, { bold, italic, strikethru: strike, align: alignRequest })
    }

    return {
        bold,
        italic,
        strike,
        align,
        toggleBoldOn,
        toggleBoldOff,
        toggleItalicOn,
        toggleItalicOff,
        toggleStrikethruOn,
        toggleStrikethruOff,
        updateAlign
    }
}

export default useTopbarState
