import { Title } from '@mantine/core'
import { IconFolder } from '@tabler/icons'
import styles from '../file-explorer.module.scss'
import { IExplorerFolder } from '../types'

interface IDriveFolderProps {
    folder: IExplorerFolder,
    activeItem: string | null,
    setActiveItem: (id: string | null) => void,
    setActiveDirectory: (id: string) => void
}

const DriveFolder: React.FC<IDriveFolderProps> = ({ folder, activeItem, setActiveItem, setActiveDirectory }) => {
    return (
        <div 
            onClick={() => { setActiveItem(folder.folder_id) }}
            onDoubleClick={() => { setActiveDirectory(folder.folder_id) }}
            className={`${styles.folder} ${activeItem === folder.folder_id && styles.active}`}
        >
            <IconFolder size={22} />
            <Title order={5} className={styles.title}>{folder.folder_name}</Title>
        </div>
    )
}

export default DriveFolder