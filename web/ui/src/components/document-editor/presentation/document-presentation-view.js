import React, { useEffect, useState } from 'react'

import {
    Box,
    Title,
    ScrollArea,
    Image,
    Text
} from '@mantine/core'

import DocumentAuthor   from "./document-author"
import DocumentRenderer from "./document-renderer"

import { connect } from "react-redux"

const DocumentPresentationView = 
    ({ max_height, preview, documentP, document_id, project, articleTitle, articleImage, author, documentSetter, official }) => {
    const [document, setDocument] = useState(null)

    useEffect(() => {
        if(preview) {
            let documents = project['project_data']['documents']
            let document_tmp  = null

            for(let i = 0; i < documents.length; i++) {
                let document_ = documents[i]
                if(document_.document_id == document_id)
                    document_tmp = document_
            }

            if(document_tmp !== null) {
                setDocument(document_tmp)
                documentSetter(document_tmp)
            }
        } else {
            setDocument(documentP)
        }
    }, [])

    useEffect(() => {
        if(preview == false)
            setDocument(documentP)
    }, [documentP])

    return (
        <ScrollArea
            style={{ maxHeight: `${max_height}px` }}
            pb={'sm'}
        >
            <Box
                sx={(theme) => ({
                    textAlign: 'left',
                    backgroundColor: theme.colors.dark[8],
                    border: official ? '' : `2px solid ${theme.colors.dark[5]}`,

                    flexGrow: 1,

                    padding: theme.spacing.md,
                    marginTop: theme.spacing.sm,
                    borderRadius: theme.radius.md,

                    paddingLeft: theme.spacing.xl,
                    paddingRight: theme.spacing.xl,
                    paddingBottom: 32
                })}
            >
                <Title
                    order={1}
                    sx={{ fontSize: 45 }}
                >
                    {articleTitle !== undefined && (
                        <Box>
                            {articleTitle.title == null || articleTitle.title.length == '0' && (
                                <span>Article Title</span>
                            )}
                            {articleTitle.title}
                        </Box>
                    )}
                </Title>

                <Title
                    order={2}
                    mb={"md"}
                    sx={(theme) => ({
                        color: theme.colors.dark[2],
                        fontSize: 30
                    })}
                >
                    {articleTitle !== undefined && (
                        <Box>
                            {articleTitle.subtitle == null || articleTitle.subtitle.length == '0' && (
                                <span>Short Description of Article</span>
                            )}
                            {articleTitle.subtitle}
                        </Box>
                    )}
                </Title>

                {author !== undefined && ( <DocumentAuthor author={author} /> )}

                { articleImage !== undefined && (
                    <Box>
                        {articleImage !== null && (
                            <Image
                                radius={"md"}
                                mt={"md"}
                                fit={"fill"}
                                height={425}
                                src={articleImage}
                            />
                        )}
                    </Box>
                )}

                <Box mt={'sm'}>
                    <DocumentRenderer
                        document={document}
                        max_height={max_height}
                    />
                </Box>
            </Box>
        </ScrollArea>
    )
}

const mapStateToProps = state => ({
    project: state.project
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentPresentationView)