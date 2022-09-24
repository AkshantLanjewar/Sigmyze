import React from 'react'

import { Box, Button, Menu } from '@mantine/core'

import { AiFillFolderAdd } from 'react-icons/ai'
import { MdAdd }           from 'react-icons/md'
import { VscGraphLine }    from 'react-icons/vsc'

const DriveCreateMenu = ({}) => {
    return (
        <Box>
            <Menu 
                shadow={"md"} 
                width={200}
                withArrow
                position='right-start'
            >
                <Menu.Target>
                    <Button 
                        variant='filled'
                        color={"indigo"}
                        radius={"xl"}
                        size={"md"}
                        ml={"md"}

                        sx={{ 
                            width: "50%", 
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white'
                        }}
                    >
                        <MdAdd size={22} style={{ marginRight: 1 }} />
                        <span>New</span>
                    </Button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item icon={<AiFillFolderAdd size={18} />}>Folder</Menu.Item>
                    <Menu.Divider />

                    <Menu.Item icon={<VscGraphLine size={18} />}>Lunar Project</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Box>
    )
}

export default DriveCreateMenu