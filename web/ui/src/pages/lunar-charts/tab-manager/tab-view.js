import React, { useState } from 'react'

import ChartView      from './views/chart-view'
import DocumentView   from './views/document-view'
import PublishingView from "./views/publishing-view";

import { 
    Box,
    ScrollArea 
} from '@mantine/core'

const TabView = ({ tab, scale_change }) => {
    const [height, setHeight] = useState(null)
    const ref = React.useCallback((node) => {
        if(node !== null) {
            setHeight(node.clientHeight)
        }
    })

    return (
        <Box sx={{ height: '100%' }} ref={ref}>
            <Box sx={{ height: height !== null ? height : 'auto' }} >
                {tab.type == 'chart'
                    ? ( 
                        <ChartView 
                            height={height}
                            indicators={tab.indicators} 
                            scale_change={height} 
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
                            height={height}
                        />
                    )
                    : null
                }

                {tab.type == 'publishing' && (
                    <PublishingView
                        document_id={tab['document_id']}
                        document_name={tab['name']}
                        height={height}
                    />
                )}
            </Box>
        </Box>
    )
}

export default TabView