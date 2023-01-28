import { Menu, Stack, Tooltip, UnstyledButton } from "@mantine/core"
import { IconBox, IconDeviceFloppy, IconFolderPlus, IconPlus } from "@tabler/icons"
import { useContext, useState } from "react"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import ModalManager from "../../modal-manager"
import nav_styles from '../navbar.module.scss'
import NewFolderModal from "./new-folder-modal"
import NewProjectModal from "./new-project-modal"

const driveViews = [
    { icon: IconDeviceFloppy, label: "Drive" }
]

const DriveNavbar: React.FC = ({ }) => {
    const { loggedIn } = useContext(UserContextData) as IUserContext
    
    const [activeIndex, setActiveIndex] = useState(0)

    //NOTE: This handles the openning and closing of the modal
    const [modalState, setModalState] = useState<string | null>(null)
    const closeModal = () => setModalState(null)
    

    const links = driveViews.map((link, index) => (
        <Tooltip 
            label={link.label} 
            position={'right'}
            withArrow
        >
            <UnstyledButton
                onClick={() => {  }}
                className={`${nav_styles.actionButton} ${index === activeIndex && nav_styles.active}`}
            >
                <link.icon stroke={2} />
            </UnstyledButton>
        </Tooltip>
    ))

    let drivePage = false
    if(typeof window !== 'undefined')
        drivePage = window.location.pathname === '/' 

    return (
        <div>
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
            </ModalManager>

            {(loggedIn === true && drivePage) && (
                <Stack justify={"center"} spacing={10} mb={32}>
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
                                <UnstyledButton className={`${nav_styles.actionButton}`}>
                                    <IconPlus />
                                </UnstyledButton>
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

                    {links}
                </Stack>
            )}
        </div>
    )
}

export default DriveNavbar