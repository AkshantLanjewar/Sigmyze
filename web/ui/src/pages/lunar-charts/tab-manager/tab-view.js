import React from 'react'

import ChartView      from './views/chart-view'
import DocumentView   from './views/document-view'
import PublishingView from "./views/publishing-view";

import { Box } from '@mantine/core'

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
                ? (
                    <DocumentView 
                        data_location={tab.data_loc}
                        scale_change={scale_change} 
                        tab={tab}
                    />
                )
                : null
            }

            {tab.type == 'publishing' && (
                <PublishingView
                    document_id={tab['document_id']}
                    document_name={tab['name']}
                />
            )}
        </Box>
    )
}

export default TabView