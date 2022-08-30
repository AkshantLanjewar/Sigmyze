import React from 'react'

import ChartView    from './views/chart-view'
import DocumentView from './views/document-view'

import { Box, ScrollArea } from '@mantine/core'

const TabView = ({ tab, scale_change }) => {
    return (
        <Box sx={{ height: '100%' }}>
            {tab.type == 'chart'
                ? ( 
                    <ChartView 
                        indicators={tab.indicators} 
                        scale_change={scale_change} 
                        tab={tab}
                    /> 
                )
                : null
            }

            {tab.type == 'document' 
                ? <DocumentView scale_change={scale_change} />
                : null
            }
        </Box>
    )
}

export default TabView