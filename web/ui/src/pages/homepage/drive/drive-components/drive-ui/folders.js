import React, { useState } from 'react'

import { 
    Box, 
    Text, 
    Title,
    SimpleGrid,
    Menu,
    ActionIcon 
} from '@mantine/core'

import { useHover } from '@mantine/hooks'

import FolderModal from './modals/folder-modal'

import { AiFillFolder } from 'react-icons/ai'
import { 
    TbDots,
    TbSettings,
    TbTrash 
} from 'react-icons/tb'

const Folder = ({ folder, SetWorkingDirectory, GetFolderData }) => {
    const { hovered, ref }            = useHover()
    const [opened, setOpened]         = useState(false)
    const [modalState, setModalState] = useState("update")

    function Update() {
        setModalState("update")
        setOpened(true)
    }

    function Delete() {
        setModalState("delete")
        setOpened(true)
    }

    return (
        <Box id={`drive-folder-${folder.folder_id}`} ref={ref}>
            <FolderModal
                opened={opened}
                setOpened={setOpened}
                modalState={modalState}
                id={folder.folder_id}
                title={folder.folder_name}
                GetFolderData={GetFolderData}
            />

            <Box
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,

                    borderRadius: theme.radius.sm,
                    border: `1px solid ${theme.colors.dark[4]}`,
                    
                    padding: theme.spacing.md,
                    userSelect: 'none',

                    '&:hover': {
                        cursor: 'pointer',
                        backgroundColor: theme.colors.dark[6],
                        color: theme.colors.dark[0]
                    }
                })}

                onDoubleClick={() => { SetWorkingDirectory(folder.folder_id) }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10
                    }}
                >
                    <AiFillFolder size={28} />
                    <Title order={5}>{folder.folder_name}</Title>
                </Box>
                
                {hovered && (
                    <Menu
                        shadow={"md"}
                        width={200}
                        position={"right"}
                        withArrow
                    >
                        <Menu.Target>
                            <ActionIcon>
                                <TbDots size={16} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown sx={(theme) => ({ backgroundColor: theme.colors.dark[7] })}>
                            <Menu.Item
                                icon={<TbSettings size={18} />}
                                onClick={() => { Update() }}
                            >
                                Update Folder
                            </Menu.Item>

                            <Menu.Item
                                icon={<TbTrash size={18} />}
                                onClick={() => { Delete() }}
                            >
                                Delete Folder
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                )}
            </Box>
        </Box>
    )
}

const DriveFolders = ({ folders, GetFolderData, SetWorkingDirectory }) => {
    return (
        <Box mb={"xl"} mt={'xl'}>
            {folders.length > 0
                ? (
                    <Box>
                        <Text 
                            size={"sm"} 
                            color={"dimmed"} 
                            transform={"uppercase"}
                        >
                            Folders
                        </Text> 

                        <SimpleGrid
                            cols={6}
                            spacing={"md"}
                            mt={"sm"}
                        >
                            {folders.map((step, i) => (
                                <Folder
                                    folder={step}
                                    key={`folder-${i}`}
                                    GetFolderData={GetFolderData}
                                    SetWorkingDirectory={SetWorkingDirectory}
                                />
                            ))}
                        </SimpleGrid>
                    </Box>
                )

                : null
            }
        </Box>
    )
}

export default DriveFolders