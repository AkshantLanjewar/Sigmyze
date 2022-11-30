import React, { useEffect, useState } from 'react'

import ChartTable   from '../components/chart-table'
import ChartPreview from '../components/chart-preview'

const PreviewView = ({ AddObject, RemoveObject, selected }) => {
    return (
        <div>
            <ChartTable 
                AddObject={AddObject}
                RemoveObject={RemoveObject}
            />

            <ChartPreview selected={selected} />
        </div>
    )
}

export default PreviewView
