import React   from 'react'
import { Box } from '@mantine/core'

import DocumentEditor from '../../../../components/document-editor/document-editor'

const DocumentView = ({ }) => {
    return (
        <Box
            sx={{
                flexGrow: 1,
                height: "100%"
            }}
        >
            <DocumentEditor />
        </Box>
    )
}

export default DocumentView