import React, { useEffect, useState } from 'react'

import {
    Box,
    Title
} from '@mantine/core'

import DocumentPresentationView from "../../../../components/document-editor/presentation/document-presentation-view"

const DocumentPreview = ({ document_id, articleTitle, articleImage, author }) => {
    const ref                 = React.createRef()
    const [height, setHeight] = useState(0)

    useEffect(() => {
        setHeight(800)
    }, [])

    return (
        <Box
            sx={{
                width: 816,
                height: '98.5%',
                textAlign: 'center',

                display: 'flex',
                flexDirection: 'column',
            }}

            ref={ref}
        >
            <Title order={6} style={{ textTransform: 'uppercase' }}>Preview</Title>

            <DocumentPresentationView
                document_id={document_id}
                max_height={height}
                preview={true}
                articleTitle={articleTitle}
                articleImage={articleImage}
                author={author}
            />
        </Box>
    )
}

export default DocumentPreview