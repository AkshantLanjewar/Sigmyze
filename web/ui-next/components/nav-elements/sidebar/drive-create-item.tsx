import { Menu, Tooltip } from "@mantine/core"
import { IconAtom2, IconBox, IconFolderPlus, IconPlus } from "@tabler/icons"
import { useState } from "react"
import ModalManager from "../../ui/modal-manager"
import NewFolderModal from "./modal-views/new-folder-modal"
import NewProjectModal from "./modal-views/new-project-modal"
import NewQuantaModal from "./modal-views/new-quanta-modal"
import styles from './sidebar.module.scss'

/**
 * @description
 *  this is the menu that handles the creation of new
 *  items in the drive such as folders and projects.
 * @returns create menu
 */
const DriveCreateItem: React.FC = ({ }) => {
    /**
     * @description
     *  handles the state of the modal manager
     * @state create-folder
     *  this opens the create-folder modal
     * @state create-lunar-project
     *  this opens the create lunar project modal
     */
    const [modalState, setModalState] = useState<string | null>(null)

    /**
     * @function
     *  this function closes the modal
     */
    const closeModal = () => setModalState(null)
    
    return (
        <>
            <ModalManager
                modalState={modalState}
                close={closeModal}
            >
                <ModalManager.Modal
                    title={'Create Folder'}
                    id={'create-folder'}
                >
                    <NewFolderModal close={closeModal} />
                </ModalManager.Modal>

                <ModalManager.Modal
                    title={'Create Lunar Project'}
                    id={'create-lunar-project'}
                >
                    <NewProjectModal close={closeModal} />
                </ModalManager.Modal>

                <ModalManager.Modal
                    title="Create Quanta Project"
                    id={'new-quanta-project'}
                >
                    <NewQuantaModal close={closeModal} />
                </ModalManager.Modal>
            </ModalManager>

            <Menu
                withArrow
                width={225}
                position={'right-start'}
                transition={'slide-right'}
                shadow={"md"}
            >
                <Menu.Target>
                    <Tooltip 
                        label={"Create Item"} 
                        position={'right'}
                        withArrow
                    >
                        <div className={`${styles.element}`}>
                            <IconPlus />
                        </div>
                    </Tooltip>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        onClick={() => { setModalState('create-folder') }}
                        icon={ <IconFolderPlus size={18} /> }
                    >
                        New Folder
                    </Menu.Item>

                    <Menu.Item 
                        onClick={() => { setModalState('create-lunar-project') }}
                        icon={<IconBox size={18} />}
                    >
                        New Lunar Project
                    </Menu.Item>

                    <Menu.Item
                        onClick={() => setModalState("new-quanta-project")}
                        icon={<IconAtom2 size={18} />}
                    >
                        New Quanta Project
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    )
}

export default DriveCreateItem