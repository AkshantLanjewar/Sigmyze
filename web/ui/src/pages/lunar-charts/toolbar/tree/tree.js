import React from 'react'

import TreeNode from './node'

import { Box, Text } from '@mantine/core'

const ProjectTree = ({ root }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: "100%"
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    userSelect: 'none',
                    paddingLeft: 15,
                    paddingRight: 15,
                    marginTop: 10,
                    marginBottom: 10
                }}
            >
                <Text
                    size={'xs'}
                    color={'dimmed'}
                    weight={600}
                    transform={'uppercase'}
                >
                    Explorer
                </Text>
            </Box>

            {root.map((step) => (
                <TreeNode 
                    additional_padding={0}
                    node_title={step.node_title}
                    node_icon={step.node_icon}
                    children={step.children}
                    hoverActions={step.hoverActions}
                    actions={step.actions}
                    default_open={step.default_open}
                    useTooltip={step.useTooltip}
                    tooltipText={step.tooltipText}
                    key={step.node_id}
                />
            ))}
        </Box>
    )
}

export default ProjectTree