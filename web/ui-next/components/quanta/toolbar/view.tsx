import { memo } from 'react'
import styles from './toolbar.module.scss'
import dropdownStyles from '../../lunar/explorer/explorer.module.scss'
import Tree, { ITreeNode } from '../../tree/tree'
import { Text } from '@mantine/core'

interface IViewProps {
    displayNodes: ITreeNode[],
    setActive(id: string, type: string): void
}

const QToolbarView: React.FC<IViewProps> = memo(({ displayNodes, setActive }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.stackViewport}>
                <div className={styles.title}>
                    <Text 
                        size={"xs"}
                        weight={"bold"}
                        color={"dimmed"}
                        transform={"uppercase"}
                    >
                        Quanta Editor
                    </Text>
                </div>

                <div style={{ marginTop: 0, position: 'relative', height: '100%' }}>
                    <div className={dropdownStyles['scroll-wrapper']}>
                        <div className={dropdownStyles.content}>
                            <Tree nodes={displayNodes} setActive={setActive} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default QToolbarView