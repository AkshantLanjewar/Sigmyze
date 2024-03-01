import { useEffect, useState, CSSProperties } from "react"
import { HeadingValues, TextValues } from "../../../topbar/text-selector/transform"
import { IBlockStyles, INoteBlock } from "../../../types"
import { Property } from 'csstype'

const useBlockStyles = (
    /*
     * This is the block that we are getting the style state for 
     */ 
    block: INoteBlock,

    /*
     * This is the function that gets a block's styles 
     */ 
    getBlockStyles: (blockId: string) => IBlockStyles | undefined
) => {
    //whether or not the block is bolded
    const [bold, setBold] = useState<boolean>(false)

    //whether or not the block is italicized
    const [italic, setItalic] = useState<boolean>(false)

    //whether or not the block is struck through
    const [strikeThru, setStrikeThru] = useState<boolean>(false)

    //the justification of the block 
    const [align, setAlign] = useState<'left' | 'center' | 'right' | 'justified'>('left')

    //these are the styles that are computed from the state 
    const [computed, setComputed] = useState<CSSProperties>({})

    //this is the function that gets the blocks styles when the block updates
    useEffect(() => {
        const styles = getBlockStyles(block.blockId)
        if(styles === undefined || styles === null)
            return
        
        setBold(styles.bold)
        setItalic(styles.italic)
        setStrikeThru(styles.strikethru)
        setAlign(styles.align)
    }, [block])

    //this is the effect that computes the final styles
    useEffect(() => {
        let textAlign: Property.TextAlign = "left"
        let useTextAlign = TextValues.includes(block.blockType)
        switch(align) {
            case "center":
                textAlign = "center"
                break 
            case "right":
                textAlign = "right"
                break 
            case "justified":
                textAlign = "justify"
                break
            default:
                break
        }

        let fontWeight: Property.FontWeight = "normal"
        if(block.blockType === "paragraph" && bold === true)
            fontWeight = "bold"

        if(HeadingValues.includes(block.blockType) && bold === true)
            fontWeight = 900
        else if(HeadingValues.includes(block.blockType) && bold === false) 
            fontWeight = 700

        let fontStyle: Property.FontStyle = "normal"
        if(italic === true)
            fontStyle = "italic"

        let textDecoration: Property.TextDecoration = "none"
        if(strikeThru === true)
            textDecoration = "line-through"

        let justifyContent: Property.JustifyContent = "center"
        switch(align) {
            case "left":
                justifyContent = "left"
                break 
            case "right":
                justifyContent = "right"
                break 
            case "justified":
                justifyContent = "stretch"
                break
        }

        setComputed({ 
            textAlign: useTextAlign ? textAlign : "left", 
            fontWeight: useTextAlign ? fontWeight : "normal", 
            fontStyle: useTextAlign ? fontStyle : "normal",
            textDecoration: useTextAlign ? textDecoration : "none",
            justifyContent: useTextAlign ? "normal" : justifyContent
        })
    }, [block, bold, italic, strikeThru, align])

    return {
        computed
    }
}

export default useBlockStyles
