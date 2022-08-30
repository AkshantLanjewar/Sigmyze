import React, { useState, useEffect } from 'react'

import { Box }         from '@mantine/core'
import { usePrevious } from '../../../lib'

import ModalView from './chart-modal'

const ChartBlock = ({ block, UpdateNode, CreateBlock, DeleteBlock }) => {
    const [opened, setOpened] = useState(false)
    const prevOpened          = usePrevious(opened)

    const [created, setCreated] = useState(false)

    useEffect(() => {
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
        if(indicator_data !== undefined && indicator_data.length > 0)
            setCreated(true)
    }, [block['data']])

    return (
        <Box>
            {created
                ? null
                : <ModalView opened={opened} setOpened={setOpened} />
            }
        </Box>
    )
}

export default ChartBlock