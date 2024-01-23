import { Blocks, INoteBlock } from '../types'
import { NoteChart, NoteParagraph } from './block-types'
import NoteHeading from './block-types/text/heading'
import styles from './index.module.scss'
import NoteTitle from './note-title'

const BLOCK_SWITCH = (
    /**
     * This is the block that is being rendered
     */
    step: INoteBlock,

    /**
     * whether or not there is a focus request within the editor
     */
    hasRequest: boolean,

    /**
     * This is the index of the block
     */
    index: number,

    /**
     * this is the length of the block list
     */
    blocksLength: number,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * This is the function that consumes a focus request
     */
    consumeFocusRequest: (blockId: string) => boolean,

    /**
     * This is the function that updates a note block
     */
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,

    /**
     * This is the function that inserts a RAW new block
     */
    createRawBlock: (type: Blocks) => void,

    /**
     * This is the function that deletes a block from the renderer
     */
    deleteNoteBlock: (blockId: string) => void
) => {
    switch(step.blockType) {
        case "paragraph":
            return (
                <NoteParagraph 
                    block={step} 
                    hasRequest={hasRequest}
                    endblock={index === (blocksLength - 1)}
                    updateNoteBlock={updateNoteBlock} 
                    consumeFocusRequest={consumeFocusRequest}
                    changeNoteBlock={changeNoteBlock}
                />
            )
        case "heading::1":
        case "heading::2":
        case "heading::3":
        case "heading::4":
        case "heading::5":
        case "heading::6":
            const headingSplit = step.blockType.split("::")
            const order = parseInt(headingSplit[1])

            return (
                <NoteHeading
                    block={step}
                    hasRequest={hasRequest}
                    endblock={index === (blocksLength - 1)}
                    order={order}
                    updateNoteBlock={updateNoteBlock} 
                    consumeFocusRequest={consumeFocusRequest}
                    changeNoteBlock={changeNoteBlock}
                />
            )
        case "media::chart":
            return (
                <NoteChart
                    block={step}
                    hasRequest={hasRequest}
                    updateNoteBlock={updateNoteBlock} 
                    consumeFocusRequest={consumeFocusRequest}
                    changeNoteBlock={changeNoteBlock}
                    createRawBlock={createRawBlock}
                    deleteNoteBlock={deleteNoteBlock}
                />
            )
        default:
            return undefined
    }
}

interface IBlockRendererProps {
    /**
     * These are the blocks to be rendered within the note
     */
    blocks: INoteBlock[]

    /**
     * This is the current title of the note
     */
    title: string,

    /**
     * whether or not there is a focus request within the editor
     */
    hasRequest: boolean,

    /**
     * This is the function that can edit the note title
     */
    editNoteName: (newTitle: string) => void,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * This is the function that consumes a focus request
     */
    consumeFocusRequest: (blockId: string) => boolean,

    /**
     * This is the function that updates a note block
     */
    changeNoteBlock: (blockId: string, newType: Blocks, newContent: string) => void,

    /**
     * This is the function that inserts a RAW new block
     */
    createRawBlock: (type: Blocks) => void,

    /**
     * This is the function that deletes a block from the renderer
     */
    deleteNoteBlock: (blockId: string) => void
}

const BlockRenderer: React.FC<IBlockRendererProps> = ({ 
    blocks, 
    title, 
    hasRequest, 
    editNoteName, 
    updateNoteBlock,
    consumeFocusRequest,
    changeNoteBlock,
    createRawBlock,
    deleteNoteBlock 
}) => {
    return (
        <div className={styles.document__wrapper}>
            <div
                className={styles.document__renderer}
            >
                <NoteTitle 
                    title={title}
                    editNoteName={editNoteName}
                />

                <div
                    data-testId={"document-container"}
                    className={styles.document__renderer}
                    style={{ flexGrow: 1 }}
                >
                    {blocks.map((step, index) => (
                        <div 
                            data-testId={`document-block-${index}`}
                            data-testValue={step.blockType}
                        >
                            {BLOCK_SWITCH(
                                step, 
                                hasRequest, 
                                index, 
                                blocks.length, 
                                updateNoteBlock, 
                                consumeFocusRequest,
                                changeNoteBlock,
                                createRawBlock,
                                deleteNoteBlock
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BlockRenderer