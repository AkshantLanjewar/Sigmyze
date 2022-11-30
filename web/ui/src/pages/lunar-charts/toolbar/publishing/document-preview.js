import React, { useEffect, useState } from 'react'

import {
    Box,
    Title
} from '@mantine/core'

import DocumentPresentationView from "../../../../components/document-editor/presentation/document-presentation-view"

const DocumentPreview = ({ document_id, articleTitle, articleImage, author, setDocument }) => {
    const ref                 = React.createRef()
    const [height, setHeight] = useState(0)

    useEffect(() => {
        setHeight(1123)
    }, [])

    return (
        <Box
            sx={{
                width: 794,
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
                documentSetter={setDocument}
            />
        </Box>
    )
}

export default DocumentPreview