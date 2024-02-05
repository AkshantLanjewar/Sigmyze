import styles from './index.module.scss'

import TextSelector from './text-selector'
import TextStyleSection from './text-style'
import BlockAlignSection from './block-align'
import BlockMediaSection from './block-media'

interface INoteTopbarProps {

}

const NoteTopbar: React.FC<INoteTopbarProps> = ({ }) => {
    return (
        <div
            data-testId={'document-topbar'}
            className={styles.topbar}
        >
            <div 
                data-testId={"section-0"}
                className={styles.section}
            >
                <TextSelector />
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