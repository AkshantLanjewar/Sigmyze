import { useCallback, useState } from "react";
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
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void
) => {
    /**
     * This is the selected image data that has to be serialized / deserialized from the block content
     * NOTE: The modal will fire when this is undefined
     */
    const [image, setImage] = useState<ISerializedNoteImage | undefined>(undefined)

    //whether or not to render the body
    const [render, setRender] = useState<boolean>(false)

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
        setRender(true)
    }

    return {
        image,
        render,
        cancelImageSelect,
        updateImage
    }
}

export default useNoteImage