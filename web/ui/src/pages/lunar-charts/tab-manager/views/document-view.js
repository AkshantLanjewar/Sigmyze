import React   from 'react'
import { Box } from '@mantine/core'

import DocumentEditor from '../../../../components/document-editor/document-editor'

const DocumentView = ({ scale_change, data_location, tab }) => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                height: "100%"
            }}
        >
            <DocumentEditor 
                data_location={data_location}
                scale_change={scale_change}  
                tab={tab}
            />
        </Box>
    )
}

export default DocumentView