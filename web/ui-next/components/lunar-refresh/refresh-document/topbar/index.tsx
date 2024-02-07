import styles from './index.module.scss'

import TextSelector from './text-selector'
import TextStyleSection from './text-style'
import BlockAlignSection from './block-align'
import BlockMediaSection from './block-media'
import { Blocks, INoteBlock } from '../types'

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
     * this is the function that handles the changing of the requested note block
    */
    changeNoteBlock: (blockId: string, newTypes: Blocks, newContent: string) => void
}

const NoteTopbar: React.FC<INoteTopbarProps> = ({ activeBlock, blocks, changeNoteBlock }) => {
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
                <TextStyleSection />
            </div>

            <div className={styles.divider}></div>

            <div 
                data-testId={"section-2"}
                className={styles.section}
            >
                <BlockAlignSection />
            </div>

            <div className={styles.divider}></div>

            <div 
                data-testId={"section-3"}
                className={styles.section}
            >
                <BlockMediaSection />
            </div>
        </div>
    )
}

export default NoteTopbar
