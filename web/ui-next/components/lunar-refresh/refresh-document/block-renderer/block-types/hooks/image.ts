import { useCallback, useEffect, useState } from "react";
import { Blocks, INoteBlock } from "../../../types";
import { ISerializedNoteImage } from "../media/types";

/**
 * @description
 *  - this is the hook that encapsulates all the state and logic required for the image block to work
 */
const useNoteImage = (
    /**
     * This is the block that is being rendered
     */
    block: INoteBlock,

    /**
     * This is the function that updates a note block
     */
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,

    /**
     * this is the function that updates the blocks content within the editor and context store
     */
    updateNoteBlock: (blockId: string, newContent: string) => void
) => {
    /**
     * This is the selected image data that has to be serialized / deserialized from the block content
     * NOTE: The modal will fire when this is undefined
     */
    const [image, setImage] = useState<ISerializedNoteImage | undefined>(undefined)

    //whether or not to render the body
    const [render, setRender] = useState<boolean>(false)

    //whether or not the data has been loaded
    const [loaded, setLoaded] = useState<boolean>(false)

    /**
     * @description
     *  - this is the function that cancel's selecting an image
     */
    const cancelImageSelect = useCallback(() => {
        setImage({
            width: 0,
            height: 0,
            data: ""
        })

        changeNoteBlock(block.blockId, "paragraph", "")
    }, [block])

    const updateImage = (newImage: ISerializedNoteImage) => {
        if(newImage.marshalCheck !== "swagmarsh")
            return

        setImage({ ...newImage })
        updateNoteBlock(block.blockId, JSON.stringify(newImage))
        setRender(true)
    }

    //effect that handles the loading of the block on init
    useEffect(() => {
        try {
            const parsed: ISerializedNoteImage = JSON.parse(block.blockContent)
            if(parsed.marshalCheck !== "swagmarsh") {
                setLoaded(true)
                return
            }

            updateImage(parsed)
            setLoaded(true)
        } catch (e) { 
            setLoaded(true)
            return 
        }
    }, [])

    return {
        image,
        render,
        loaded,
        cancelImageSelect,
        updateImage
    }
}

export default useNoteImage