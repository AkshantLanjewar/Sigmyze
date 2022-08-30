import React from 'react'

import ChartPreview from '../components/chart-preview'
import ChartText    from '../components/chart-text'

const TextView = ({ selected, title, description, ParseText }) => {
    return (
        <div>
            <ChartPreview selected={selected} />

            <ChartText 
                title={title}
                description={description}
                ParseText={ParseText}
            />
        </div>
    )
}

export default TextView