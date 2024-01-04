import { INoteBlock } from '../types'
import { NoteParagraph } from './block-types'
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
    consumeFocusRequest: (blockId: string) => boolean
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
    consumeFocusRequest: (blockId: string) => boolean
}

const BlockRenderer: React.FC<IBlockRendererProps> = ({ 
    blocks, 
    title, 
    hasRequest, 
    editNoteName, 
    updateNoteBlock,
    consumeFocusRequest 
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
                >
                    {blocks.map((step, index) => (
                        <div 
                            data-testId={`document-block-${index}`}
                            data-testValue={step.blockType}
                        >
                            {BLOCK_SWITCH(step, hasRequest, index, blocks.length, updateNoteBlock, consumeFocusRequest)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BlockRenderer