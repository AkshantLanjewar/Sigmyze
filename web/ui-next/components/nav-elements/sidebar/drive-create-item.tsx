import { Menu, Tooltip } from "@mantine/core"
import { IconBox, IconFolderPlus, IconPlus } from "@tabler/icons"
import { useState } from "react"
import styles from './sidebar.module.scss'

const DriveCreateItem: React.FC = ({ }) => {
    //NOTE: This handles the openning and closing of the modal
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)
    
    return (
        <Menu
            withArrow
            width={200}
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
            </Menu.Dropdown>
        </Menu>
    )
}

export default DriveCreateItem