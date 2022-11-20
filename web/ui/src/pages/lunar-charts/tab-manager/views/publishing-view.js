import React, { useState } from 'react'
import { Box } from '@mantine/core'

import DocumentPreview  from "../../toolbar/publishing/document-preview"
import DocumentSettings from "../../toolbar/publishing/document-settings"
import PublishingDialog from '../../toolbar/publishing/publishing-dialog'

const PublishingView = ({ height, document_id, document_name }) => {
    const [articleImage, setArticleImage] = useState(null)
    const [articleTitle, setArticleTitle] = useState({ title: null, subtitle: null })
    const [author, setAuthor]             = useState({ icon: null, name: null })

    function Publish(title, subtitle) {

    }

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
            <PublishingDialog />
            
            <DocumentPreview
                document_id={document_id}
                articleImage={articleImage}
                articleTitle={articleTitle}
                author={author}
            />

            <DocumentSettings 
                articleImage={articleImage}
                setArticleImage={setArticleImage}
                setArticleTitle={setArticleTitle}
                setAuthor={setAuthor}
                height={height}
                Publish={Publish}
            />
        </Box>
    )
}

export default PublishingView