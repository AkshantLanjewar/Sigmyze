import styles from './index.module.scss'

import TextSelector from './text-selector'
import TextStyleSection from './text-style'
import BlockAlignSection from './block-align'
import BlockMediaSection from './block-media'
import { Blocks, IBlockStyles, INoteBlock } from '../types'
import useTopbarState from './state'

interface INoteTopbarProps {
    /**
     * this is the active block within the editor
     */
    activeBlock: string | undefined,

    /**
     * These are the blocks that are rendered within the editor
     */
    blocks: INoteBlock[],

    /*
     * Whether or not the styles have been updated
     */
    stylesUpdated: boolean,

    /*
     * this is the function that handles the changing of the requested note block
     */
    changeNoteBlock: (blockId: string, newTypes: Blocks, newContent: string) => void,

    /*
     * This is the function that gets the block styles 
     */
    getBlockStyles: (blockId: string) => IBlockStyles | undefined,

    /*
     * This is the function that updates the block styles 
     */
    setBlockStyles: (blockId: string, styles: IBlockStyles) => void
}

const NoteTopbar: React.FC<INoteTopbarProps> = ({ activeBlock, blocks, stylesUpdated, changeNoteBlock, getBlockStyles, setBlockStyles }) => {
    const {
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
    } = useTopbarState(activeBlock, stylesUpdated, getBlockStyles, setBlockStyles)

    return (
        <div
            data-testId={'document-topbar'}
            className={styles.topbar}
        >
            <div 
                data-testId={"section-0"}
                className={styles.section}
            >
                <TextSelector 
                    activeBlock={activeBlock}
                    blocks={blocks}
                    changeNoteBlock={changeNoteBlock}
                />
            </div>

            <div className={styles.divider}></div>

            <div 
                data-testId={"section-1"}
                className={styles.section}
            >
                <TextStyleSection 
                    bold={bold}
                    italic={italic}
                    strike={strike}
                    toggleBoldOn={toggleBoldOn}
                    toggleBoldOff={toggleBoldOff}
                    toggleItalicOn={toggleItalicOn}
                    toggleItalicOff={toggleItalicOff}
                    toggleStrikethruOn={toggleStrikethruOn}
                    toggleStrikethruOff={toggleStrikethruOff}
                />
            </div>

            <div className={styles.divider}></div>

            <div 
                data-testId={"section-2"}
                className={styles.section}
            >
                <BlockAlignSection 
                    align={align}
                    updateAlign={updateAlign}
                />
            </div>

            <div className={styles.divider}></div>

            <div 
                data-testId={"section-3"}
                className={styles.section}
            >
                <BlockMediaSection 
                    activeBlock={activeBlock}
                    blocks={blocks}
                    changeNoteBlock={changeNoteBlock}
                />
            </div>
        </div>
    )
}

export default NoteTopbar
