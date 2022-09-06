import React, { useState, useEffect } from 'react'

import { Box }      from '@mantine/core'
import ChartPreview from './components/chart-preview'

const ChartView = ({ block, CreateBlock, DeleteBlock, EditChart }) => {
    let selected    = block.data.indicators
    let title       = block.data.title
    let description = block.data.description

    return (
        <Box sx={{ width: "100%" }} mb={"md"}>
            <ChartPreview
                selected={selected}
                title={title}
                description={description}
                useMenu={true}
                noMargin={true}
                block={block}
                CreateBlock={CreateBlock}
                DeleteBlock={DeleteBlock}
                EditChart={EditChart}
            />
        </Box>
    )
}

export default ChartView