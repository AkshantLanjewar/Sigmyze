import React from 'react'

import { 
    Box, 
    Breadcrumbs, 
    Menu,
    Button 
} from '@mantine/core'

const NavBox = ({ name, id, SetWorkingDirectory }) => {
    return (
        <Button
            variant={'subtle'}
            color={'teal'}
            onClick={() => { SetWorkingDirectory(id) }}
        >
            {name}
        </Button>
    )
}

const DriveToolbar = ({ paths, SetWorkingDirectory }) => {
    return (
        <Box
            p={"md"}
            mb={"xl"}
            sx={(theme) => ({
                borderBottom: `1px solid ${theme.colors.dark[3]}`
            })}
        >
            <Breadcrumbs>
                {paths.map((step => ( 
                    <NavBox 
                        name={step.name} 
                        id={step.id}
                        SetWorkingDirectory={SetWorkingDirectory}
                    /> 
                )))}
            </Breadcrumbs>
        </Box>
    )
}

export default DriveToolbar