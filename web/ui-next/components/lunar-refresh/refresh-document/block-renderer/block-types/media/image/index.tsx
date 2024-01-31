import { Blocks, INoteBlock } from "../../../../types"
import useNoteImage from "../../hooks/image"
import ImageBody from "./body"
import NoteImageModal from "./modal"

interface INoteImageProps {
    /**
     * This is the block that is being rendered
     */
    block: INoteBlock,

    /**
     * whether or not there is a focus request within the editor
     */
    hasRequest: boolean,

    /**
     * This is the function that consumes a focus request
     */
    consumeFocusRequest: (blockId: string) => boolean,

    /**
     * This is the function that updates a note block
     */
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * This is the function that inserts a RAW new block
     */
    createRawBlock: (type: Blocks) => void,

    /**
     * This is the function that deletes a block from the renderer
     */
    deleteNoteBlock: (blockId: string) => void,
}

const NoteImage: React.FC<INoteImageProps> = ({ 
    block, 
    hasRequest, 
    consumeFocusRequest, 
    changeNoteBlock, 
    updateNoteBlock, 
    createRawBlock,
    deleteNoteBlock 
}) => {
    const { image, render, cancelImageSelect, updateImage } = useNoteImage(block, changeNoteBlock)

    return (
        <>
            <NoteImageModal
                blockId={block.blockId}
                open={image === undefined}
                cancel={cancelImageSelect}
                updateNoteBlock={updateNoteBlock}
                updateImage={updateImage}
                createRawBlock={createRawBlock}
            />

            {render && (
                <ImageBody
                    blockId={block.blockId}
                    image={image!}
                    hasRequest={hasRequest}
                    consumeFocusRequest={consumeFocusRequest}
                    deleteNoteBlock={deleteNoteBlock}
                    updateImage={updateImage}
                    updateNoteBlock={updateNoteBlock}
                />
            )}
        </>
    )
}

export default NoteImage