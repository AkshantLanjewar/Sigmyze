import React, { useState, useEffect } from 'react'

import { Box } from '@mantine/core'

const DriveContextMenu = ({ targetID, options, classes }) => {
    const [menu, setMenu] = useState({ x: 0, y: 0, visible: false })
    const menuRef         = React.createRef()

    useEffect(() => {
        const contextMenuHandler = (event) => {
            const targetElement = document.getElementById(targetID)
        }

    }, [menu, targetID])

    useEffect(() => {

    }, [menu])

    return (
        <Box
            ref={menuRef}
            sx={(theme) => ({
                display: menu.visible ? 'flex' : 'none',
                flexDirection: 'column',
                justifyContent: 'center',

                width: 200,
                left: `${menu.x}px`,
                top: `${menu.y}px`
            })}
        >
            <Box
                sx={{

                }}
            >
                {options.map((step) => (
                    <Box 
                        key={step.step_id}
                        sx={{

                        }}
                    >
                        Option
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default DriveContextMenu