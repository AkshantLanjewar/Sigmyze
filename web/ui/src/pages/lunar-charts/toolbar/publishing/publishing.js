import React, { useEffect, useState } from 'react'

import {
    Box
} from '@mantine/core'

import ToolbarTitle from "../toolbar-title"
import TreeNode     from "../tree/node"

import { AiFillFolder }   from "react-icons/ai"
import { HiDocumentText } from "react-icons/hi"
import { MdPublish }      from 'react-icons/md'

import { OpenPublishingTab } from "../../../../data/actions/projectActions"
import { connect }           from "react-redux"

const LunarPublishing = ({ project, OpenPublishingTab }) => {
    const [tree, setTree] = useState([])

    useEffect(() => {
        let _tree = []

        let publishable_documents = {
            node_id: "publishable-media",
            node_title: "Publishable Media",
            node_icon: <AiFillFolder size={14} />,
            default_open: true,
            children: [],
            data: {},
            actions: []
        }

        let project_documents = project['project_data']['documents']
        for(let i = 0; i < project_documents.length; i++) {
            let document     = project_documents[i]
            let document_tab = {
                node_id: document['document_id'],
                node_title: document['document_name'],
                node_icon: <HiDocumentText size={14} />,

                children: [],
                data: {},
                actions: [
                    {
                        action_name: 'Publish',
                        action_icon: <MdPublish size={14} aria-label={"side-ico"} />,
                        action_fn: () => { OpenPublishingTab(document['document_name'], document['document_id']) }
                    }
                ]
            }

            publishable_documents['children'].push(document_tab)
        }

        _tree.push(publishable_documents)
        setTree([..._tree])
    }, [])

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <ToolbarTitle title={"Publishing"} />

            {tree.map((step) => (
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

const mapStateToProps = state => ({
    project: state.project
})

const mapDispatchToProps = dispatch => ({
    OpenPublishingTab: (document_name, document_id) => {
        dispatch(OpenPublishingTab(document_name, document_id))
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(LunarPublishing)