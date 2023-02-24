import styles   from './toolbar.module.scss'
import dropdownStyles from '../explorer/explorer.module.scss'
import { Text } from '@mantine/core'

const QuantaToolbar: React.FC = ({ }) => {
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
                        Dataset Editor
                    </Text>
                </div>

                <div style={{ marginTop: 0, position: 'relative', height: '100%' }}>
                    <div className={dropdownStyles['scroll-wrapper']}>
                        <div className={dropdownStyles.content}>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuantaToolbar