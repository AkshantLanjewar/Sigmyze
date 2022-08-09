import React, { useEffect, useState } from "react"

import { connect } from 'react-redux'
import { GetIndicator } from "../../../data/server-interface"
import { 
    RemoveIndicator, 
    OpenChartTab,
    OpenDocumentTab,
    RemoveDocument 
} from "../../../data/actions/projectActions"

import { FiPackage }    from 'react-icons/fi'
import { MdBarChart }   from 'react-icons/md'
import { MdLibraryAdd } from 'react-icons/md'
import { MdOpenInNew }  from 'react-icons/md'

import { AiFillFolder, AiFillDelete } from 'react-icons/ai'
import { FiFilePlus }                 from 'react-icons/fi'
import { HiDocumentText }             from 'react-icons/hi'

import ProjectTree from "./tree/tree"

/*
    [COMPONENT] -> Layers

    [param] indicators: list of indicators with barebones info
        1. indicator_id
        2. object_id
        3. dataset
    [param] remove_indicator: function that removes indicator based on 
        1. indicator_id
        2. object_id
*/

const Layers = ({ setOpenAdd, setDocumentModal, remove_indicator, project, open_chart_tab, open_document_tab, remove_document }) => {
    const [tree, setTree]   = useState([])

    let project_data = project.project_data
    let indicators   = project_data.indicators
    let documents    = project_data.documents

    async function main() {
        let indicators_ = []
        for(let i = 0; i < indicators.length; i++) {
            let indicator = indicators[i]
            let data      = await GetIndicator(indicator.dataset, indicator.object_id, indicator.indicator_id)
            data['object_id'] = indicator.object_id
            data['dataset']   = indicator.dataset

            indicators_.push(data)
        }

        let tmp_tree = []

        let chart_tree = {
            node_id: "chart-indicators",
            node_title: "Chart Indicators",
            node_icon: <FiPackage size={14} />,
            default_open: true,
            children: [],
            data: {},
            actions: [
                {
                    action_name: 'Add Indicator',
                    action_icon: <MdLibraryAdd size={14} aria-label='side-ico' />,
                    action_fn: () => { setOpenAdd(true) }
                }
            ]
        }

        for(let i = 0; i < indicators_.length; i++) {
            let indicator = indicators_[i]

            let tree_node = {
                node_id: `${indicator.object_id}_${indicator.indicator_id}-INDICATOR`,
                node_title: `${indicator.object_id}: ${indicator.indicator_id}`,
                node_icon: <MdBarChart size={14} />,
                children: [],
                data: {
                    object_id: indicator.object_id,
                    indicator_id: indicator.indicator_id,
                    dataset: indicator.dataset
                },

                useTooltip: true,
                tooltipText: `${indicator.object_id}: ${indicator.indicator_name}`,

                hoverActions: true,
                actions: [
                    {
                        action_name: 'Open Tab',
                        action_icon: <MdOpenInNew size={14} aria-label="side-ico" />,
                        action_fn: () => { open_chart_tab(indicator.dataset, indicator.object_id, indicator.indicator_id) }
                    },
                    {
                        action_name: 'Delete Indicator',
                        action_icon: <AiFillDelete size={14} aria-label='side-ico' />,
                        action_fn: () => { remove_indicator(indicator.object_id, indicator.indicator_id) }
                    }
                ]
            }

            chart_tree.children.push(tree_node)
        }

        let document_tree = {
            node_id: 'project-documents',
            node_title: "Project Documents",
            node_icon: <AiFillFolder size={14} />,
            default_open: true,
            children: [],
            data: {},
            actions: [
                {
                    action_name: 'Create Document',
                    action_icon: <FiFilePlus size={14} aria-label='side-ico' />,
                    action_fn: () => { setDocumentModal(true) }
                }
            ]
        }

        for(let i = 0; i < documents.length; i++) {
            let document = documents[i]
            let document_node = {
                node_id: `${document['document_id']}-${document['document_name']}-DOCUMENT`,
                node_title: document['document_name'],
                node_icon: <HiDocumentText size={14} />,
                children: [],

                data: {
                    document_id: document['document_id'],
                    data_location: document['da740411-a5b7-42dc-b43e-527f8144809f']
                },

                useTooltip: true,
                tooltipText: document['document_name'],

                hoverActions: true,
                actions: [
                    {
                        action_name: 'Open Tab',
                        action_icon: <MdOpenInNew size={14} aria-label="side-ico" />,
                        action_fn: () => { open_document_tab(document['document_name'], document['data_location']) }
                    },
                    {
                        action_name: 'Delete Document',
                        action_icon: <AiFillDelete size={14} aria-label='side-ico' />,
                        action_fn: () => { remove_document(document['document_id'], document['data_location']) }
                    }
                ]
            }

            document_tree.children.push(document_node)
        }

        tmp_tree.push(chart_tree)
        tmp_tree.push(document_tree)

        setTree([...tmp_tree])
    }

    useEffect(() => {
        main()
    }, [])

    // update the main function every time the indicator list changes
    useEffect(() => {
        main()
    }, [project])

    return (
        <div>
            <ProjectTree root={tree} />
        </div>
    )
}

const mapStateToProps = state => ({
    project: state.project
})

const mapDispatchToProps = dispatch => ({
    remove_indicator: (iso3, ind3) => dispatch(RemoveIndicator(ind3, iso3)),
    open_chart_tab: (dataset, obj_id, ind_id) => dispatch(OpenChartTab(dataset, obj_id, ind_id)),
    open_document_tab: (document_name, data_location) => dispatch(OpenDocumentTab(document_name, data_location)),
    remove_document: (document_id, data_location) => dispatch(RemoveDocument(document_id, data_location))
})

export default connect(mapStateToProps, mapDispatchToProps)(Layers)