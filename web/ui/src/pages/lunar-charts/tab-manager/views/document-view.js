import React   from 'react'
import { Box } from '@mantine/core'

import DocumentEditor from '../../../../components/document-editor/document-editor'

const DocumentView = ({ scale_change }) => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                height: "100%"
            }}
        >
            <DocumentEditor scale_change={scale_change}  />
        </Box>
    )
}

export default DocumentView