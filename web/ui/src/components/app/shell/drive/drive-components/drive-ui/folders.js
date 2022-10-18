import React from 'react'

import { 
    Box, 
    Text, 
    Title,
    SimpleGrid 
} from '@mantine/core'

import { AiFillFolder } from 'react-icons/ai'

const Folder = ({ folder, SetWorkingDirectory }) => {
    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
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
            <AiFillFolder size={28} />
            <Title order={5}>{folder.folder_name}</Title>
        </Box>
    )
}

const DriveFolders = ({ folders, SetWorkingDirectory }) => {
    return (
        <Box mb={"xl"}>
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
                        SetWorkingDirectory={SetWorkingDirectory}
                    />
                ))}
            </SimpleGrid>
        </Box>
    )
}

export default DriveFolders