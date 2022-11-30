import React, { useState, useEffect } from 'react'

import { Box }         from '@mantine/core'
import { usePrevious } from '../../../lib'

import ModalView from './chart-modal'
import ChartView from './chart-view'

const ChartBlock = ({ block, UpdateNode, CreateBlock, DeleteBlock }) => {
    const [opened, setOpened] = useState(false)
    const prevOpened          = usePrevious(opened)

    const [created, setCreated] = useState(false)

    //styles
    const [justify, setJustify] = useState('left')

    useEffect(() => {
        let b_styles  = block['styles']

        if(b_styles !== undefined) {
            let nJustify = b_styles['justify']
            setJustify(nJustify)
        }
        
        if(block.created)
            setOpened(true)
    }, [])

    useEffect(() => {
        let indicator_data = block['data']['indicators']
        if(prevOpened == true && opened == false && (indicator_data == undefined || indicator_data.length == 0))
            DeleteBlock(block.id)
    }, [opened])

    useEffect(() => {
        let indicator_data = block['data']['indicators']
        if(indicator_data == null)
            return
        if(indicator_data !== undefined && indicator_data.length > 0)
            setCreated(true)
    }, [block['data']])

    useEffect(() => {
        let styles_obj        = {}
        styles_obj['justify'] = justify

        let id   = block.id
        let data = block.data

        UpdateNode(id, "chart", data, styles_obj)
    }, [justify])

    function EditChart() {
        setCreated(false)
        setOpened(true)

        let styles_obj        = {}
        styles_obj['justify'] = justify

        let id   = block.id
        let data = {
            indicators: [],
            title: "Chart Preview",
            description: "Indicators: "
        }

        UpdateNode(id, "chart", data, styles_obj)
    }

    return (
        <Box sx={{ width: "100%" }}>
            {created
                ? (
                    <ChartView 
                        block={block}
                        justify={justify}
                        setJustify={setJustify}
                        CreateBlock={CreateBlock}
                        DeleteBlock={DeleteBlock}
                        EditChart={EditChart}
                    />
                )
                : (
                    <ModalView 
                        opened={opened} 
                        setOpened={setOpened} 
                        block={block}
                        UpdateNode={UpdateNode}
                    />
                )
            }
        </Box>
    )
}

export default ChartBlock