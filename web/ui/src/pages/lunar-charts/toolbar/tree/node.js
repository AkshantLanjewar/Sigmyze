import React, { useState } from 'react'

import { useHover } from '@mantine/hooks'
import { 
    Box,
    Text,
    Collapse,
    Tooltip,
    ActionIcon, 
} from '@mantine/core'

import { HiChevronRight } from 'react-icons/hi'

const TreeNode = ({ additional_padding, node_title, node_icon, children, hoverActions, actions, default_open, useTooltip, tooltipText }) => {
    const { hovered, ref }    = useHover()
    const [active, setActive] = useState(default_open ? true : false)

    let actions_view = (
        actions
        ? actions.map((step) => (
            <Tooltip
                label={step.action_name}
                position={'bottom-end'}
                withArrow
                color={'black'}
            >
                <ActionIcon
                    onClick={() => { step.action_fn() }}
                    value={"side-ico"}
                >
                    {step.action_icon}
                </ActionIcon>
            </Tooltip>
        ))
        : null
    )

    return (
        <Box>
            <Box
                ref={ref}
                sx={(theme) => ({
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: "100%",
                    height: 35,
                    backgroundColor: hovered ? theme.colors.dark[6] : theme.colors.dark[8],
                    color: theme.colors.dark[1],
                    cursor: 'pointer',
                    paddingLeft: 15 + additional_padding,
                    paddingRight: 10,
                    userSelect: 'none',
                    justifyContent: 'space-between'
                })}

                onClick={(e) => { 
                    let target = e.target.value
                    let tName  = e.target.tagName.toLowerCase()
                    let aria   = e.target.getAttribute('aria-label')

                    if(aria == 'side-ico')
                        return
                    if(target == 'side-ico')
                        return
                    if(tName == 'button' || tName == 'div' || tName == 'svg')
                        setActive(!active)
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center'
                    }}
                >
                    {children.length == 0 && !default_open
                        ? null
                        : (
                            <HiChevronRight 
                                size={14} 
                                style={{ transform: `rotate(${active ? '90deg' : '0deg'})` }}
                            />
                        )
                    }
                    
                    {node_icon}
                    <Text 
                        size={'xs'} 
                        transform={'uppercase'} 
                        weight={600}
                    >
                        {useTooltip
                            ? (
                                <Tooltip
                                    withArrow
                                    position={'bottom-start'}
                                    label={tooltipText}
                                    color={'black'}
                                >
                                    <Text>{node_title}</Text>
                                </Tooltip>
                            )
                            : node_title
                        }
                    </Text>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 5
                    }}
                >
                    {hoverActions
                        ? hovered ? actions_view : null
                        : actions_view
                    }
                </Box>
            </Box>

            <Collapse in={active}>
                {children.map((step) => (
                    <TreeNode
                        key={step.node_id}
                        additional_padding={additional_padding + 20}
                        node_title={step.node_title}
                        node_icon={step.node_icon}
                        children={step.children}
                        actions={step.actions}
                        useTooltip={step.useTooltip}
                        tooltipText={step.tooltipText}
                        hoverActions={step.hoverActions}
                    />
                ))}
            </Collapse>
        </Box>
    )
}

export default TreeNode