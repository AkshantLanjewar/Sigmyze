import { Group } from '@mantine/core'
import styles from './drive-toolbar.module.scss'

const DriveToolbar: React.FC = ({ }) => {
    return (
        <div className={styles.toolbarWrapper}>
            <Group style={{ width: '100%' }}>
                <div></div>

                <div className={styles.breadcrumbWrapper}>
                    
                </div>
            </Group>
        </div>
    )
}

export default DriveToolbar