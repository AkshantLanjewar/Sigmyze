import { memo } from 'react'
import styles from './lunar-refresh.module.scss'
import { UnstyledButton } from '@mantine/core'
import { TbFolderPlus, TbIrregularPolyhedronPlus } from 'react-icons/tb'
import { ISigmyzeFilesystem } from '../../ui/file-management/types'
import LunarDataManager from '../data-manager'
import FileSystemWrapper from './file-system'
import LunarViewport from './viewport'

/**
 * Theese are all the props needed in order for the lunar view to work
 */
interface IViewProps {
    /**
     * this is the filesystem that will be rendered in the explorer
     */
    fileSystem?: ISigmyzeFilesystem,

    /**
     * this is the id of the activeItem within the file system
     */
    activeItemId: string | undefined,

    /**
     * This is the settings flow toggle to be passed to the data manager
     */
    settingsFlowToggle: boolean,

    /**
     * this is the function passed to the file tree that can set the active item within the file tree
     * @param itemId 
     *  this is the id of the item we want to be set active
     * @param itemType 
     *  this is the type of object being set active, so other parameters, such as portal buttons and active folder may be correctly set as well
     */
    setItemActive: (itemId: string, itemType: string) => void,

    /**
     * this function resets the active Id to the project root folder
     */
    resetActive: () => void
}

const LunarRefreshView: React.FC<IViewProps> = memo(({ 
    fileSystem,
    activeItemId,
    settingsFlowToggle,
    setItemActive,
    resetActive 
}) => (
    <div style={{ width: "100%", height: "100%" }}>
        <LunarDataManager settingsFlowToggle={settingsFlowToggle}>
            <div style={{ width: "100%", height: "100%" }}>
                <div className={styles.lunar__container}>
                    <div className={styles.lunar__toolbar} data-testId={'sidepanel'}>
                        <div className={styles.lunar__stack}>
                            <div className={styles.title__container} data-testId={'sidepanel-title'}>
                                <span>
                                    Explorer
                                </span>

                                <div>
                                    <UnstyledButton>
                                        <TbFolderPlus size={14} />
                                    </UnstyledButton>

                                    <UnstyledButton>
                                        <TbIrregularPolyhedronPlus size={14} />
                                    </UnstyledButton>
                                </div>
                            </div>

                            {fileSystem
                                ? (
                                    <FileSystemWrapper 
                                        fileSystem={fileSystem} 
                                        activeItemId={activeItemId}
                                        setItemActive={setItemActive}
                                        resetActive={resetActive}
                                    />
                                )
                                : null
                            }
                        </div>
                    </div>

                    <LunarViewport />
                </div>
            </div>
        </LunarDataManager>
    </div>
))

export default LunarRefreshView