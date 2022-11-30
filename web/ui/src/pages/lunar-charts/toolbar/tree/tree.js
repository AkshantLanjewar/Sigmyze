import React from 'react'

import TreeNode from './node'

import { Box } from '@mantine/core'
import ToolbarTitle from "../toolbar-title"

const ProjectTree = ({ root }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: "100%"
            }}
        >
            <ToolbarTitle title={"Explorer"} />

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