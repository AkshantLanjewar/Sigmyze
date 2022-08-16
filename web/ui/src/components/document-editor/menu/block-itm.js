import React, { useEffect } from 'react'
import { useHover } from '@mantine/hooks'

import { 
    Text, 
    UnstyledButton,
    ThemeIcon,
    Group
} from '@mantine/core'

const BlockTitle = ({ label, selected }) => {
    const buttonRef = React.createRef()
    useEffect(() => {
        if(selected)
            buttonRef.current.scrollIntoView({ behavior: "smooth" })
    }, [selected])

    return (
        <Text
            size={"sm"}
            color={"dimmed"}
            sx={{ 
                userSelect: 'none', 
                height: 46 ,

                display: 'flex',
                alignItems: 'center'
            }}
            ml={'sm'}
            ref={buttonRef}
        >
            {label}
        </Text>
    )
}

const BlockItem = ({ icon, name, id, selected, updateBlockHandler }) => {
    const { ref, hovered } = useHover()
    const buttonRef        = React.createRef()

    useEffect(() => {
        if(selected)
            buttonRef.current.scrollIntoView({ behavior: "smooth" })
    }, [selected])

    return (
        <div ref={ref}>
            <UnstyledButton
                ref={buttonRef}
                sx={(theme) => ({
                    fontSize: 14,
                    border: 0,
                    outline: 'none',

                    minWidth: 0,
                    overflow: 'none',
                    textOverflow: 'ellipsis',

                    width: '100%',
                    textAlign: 'left',
                    textDecoration: 'none',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderRadius: 4,
                    
                    backgroundColor: (hovered || selected) ? theme.colors.dark[7] : theme.colors.dark[9],
                    color: theme.colors.dark[0],
                    display: 'flex',
                    alignItems: 'center'
                })}

                onClick={() => { updateBlockHandler() }}
            >
                <Group 
                    position={'apart'} 
                    noWrap
                    sx={{ 
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis' ,
                        width: '100%',
                    }}
                >
                    <Group spacing={'xs'}>
                        <ThemeIcon color={"gray"}>
                            {icon}
                        </ThemeIcon>

                        <Text 
                            size={'sm'}
                            color={'white'}
                        >
                            {name}
                        </Text>
                    </Group>

                    <Text
                        size={'sm'}
                        color={'dimmed'}

                        sx={{ 
                            width: 55,
                            maxWidth: 55,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis' 
                        }}
                    >
                        ${id}
                    </Text>
                </Group>
            </UnstyledButton>
        </div>
    )
}

export { BlockTitle }
export default BlockItem