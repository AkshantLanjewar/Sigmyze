import React, { useState } from 'react'
import { Box } from '@mantine/core'

import DocumentPreview  from "../../toolbar/publishing/document-preview"
import DocumentSettings from "../../toolbar/publishing/document-settings";

const PublishingView = ({ document_id, document_name }) => {
    const [articleImage, setArticleImage] = useState(null)

    return (
        <Box
            sx={(theme) => ({
                width: '100%',
                height: '100%',

                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',

                paddingLeft: theme.spacing.xl,
                paddingRight: theme.spacing.xl,

                color: theme.colors.dark[0]
            })}
        >
            <DocumentPreview
                document_id={document_id}
            />

            <DocumentSettings />
        </Box>
    )
}

export default PublishingView