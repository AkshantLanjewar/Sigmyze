import React, { useState, useEffect } from 'react'
import ChartRender  from "./chart-render"

const ChartView = ({ block, justify, setJustify, CreateBlock, DeleteBlock, EditChart }) => {
    let selected    = block.data.indicators
    let title       = block.data.title
    let description = block.data.description

    return (
        <ChartRender
            block={block}
            editor={true}
            justify={justify}
            setJustify={setJustify}
            CreateBlock={CreateBlock}
            DeleteBlock={DeleteBlock}
            EditChart={EditChart}
        />
    )
}

export default ChartView