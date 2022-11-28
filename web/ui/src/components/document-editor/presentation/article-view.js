import React, { useState, useEffect } from 'react'

import { Box } from '@mantine/core'

import DocumentPresentationView from './document-presentation-view'

const ArticleView = ({ article }) => {
    const [articleTitle, setArticleTitle] = useState({ title: undefined, subtitle: undefined })
    const [author, setAuthor]             = useState({ name: "Author", date: new Date() })
    const [document, setDocument]         = useState(null)

    useEffect(() => {
        let title = article['published_title']
        let subt  = article['published_subtitle']
        //author
        let uname = article['public_user']['username']
        let date  = new Date(article['published_date'])

        setArticleTitle({ title: title, subtitle: subt })
        setAuthor({ name: uname, date: date })
        setDocument(article['content'])
    }, [article])

    return (
        <Box sx={{ width: 794 }}>
            <DocumentPresentationView
                preview={false}
                max_height={1123}
                articleTitle={articleTitle}
                author={author}
                documentP={document}
            />
        </Box>
    )
}

export default ArticleView