import { Group, Text } from '@mantine/core'
import DriveFolder from './drive-items/drive-folder'
import DriveProject from './drive-items/drive-project'
import styles from './file-explorer.module.scss'
import { IExplorerFolder, IExplorerItem } from './types'

interface IFileExplorerProps {
    folders: IExplorerFolder[],
    items: IExplorerItem[],
    activeItem: string | null,
    setActiveItem: (id: string | null) => void,
    setActiveDirectory: (id: string) => void,
    setModalState: (id: string | null) => void,
    openItem: (id: string, type?: string) => void
}

const FileExplorer: React.FC<IFileExplorerProps> = 
    ({ folders, items, activeItem, setActiveItem, setActiveDirectory, setModalState, openItem }) => {
    return (
        <div className={styles.fileWrapper}>
            {folders.length > 0 && (
                <div>
                    <Text
                        transform={"uppercase"}
                        color={'dimmed'}
                        size={"sm"}
                    >
                        Folders
                    </Text>

                    <Group
                        spacing={'md'}
                        mt={'sm'}
                    >
                        {folders.map((step) => (
                            <DriveFolder 
                                folder={step} 
                                activeItem={activeItem}
                                setActiveItem={setActiveItem}
                                setActiveDirectory={setActiveDirectory}
                                setModalState={setModalState}
                            />
                        ))}
                    </Group>
                </div>
            )}

            {items.length > 0 && (
                <div>
                    <Text
                        transform={"uppercase"}
                        color={'dimmed'}
                        size={"sm"}
                    >
                        Files
                    </Text>

                    <Group
                        spacing={'md'}
                        mt={'sm'}
                    >
                        {items.map((step) => (
                            <DriveProject 
                                item={step}
                                setModalState={setModalState}
                                activeItem={activeItem}
                                setActiveItem={setActiveItem} 
                                openItem={openItem}
                            />
                        ))}
                    </Group>
                </div>
            )}
        </div>
    )
}

export default FileExplorer