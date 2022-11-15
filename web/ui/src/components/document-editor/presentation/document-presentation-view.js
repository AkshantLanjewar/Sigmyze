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

const DocumentPresentationView = ({ max_height, preview, document_id, project }) => {
    const [nodes, setNodes]       = useState([])
    const [document, setDocument] = useState(null)

    useEffect(() => {
        let documents = project['project_data']['documents']
        let document_tmp  = null

        for(let i = 0; i < documents.length; i++) {
            let document_ = documents[i]
            if(document_.document_id == document_id)
                document_tmp = document_
        }

        if(document_tmp !== null)
            setDocument(document_tmp)
    }, [])

    return (
        <ScrollArea
            style={{ height: `${max_height}px` }}
            offsetScrollbars
        >
            <Box
                sx={(theme) => ({
                    textAlign: 'left',
                    backgroundColor: theme.colors.dark[8],
                    border: `2px solid ${theme.colors.dark[5]}`,

                    flexGrow: 1,

                    padding: theme.spacing.md,
                    marginTop: theme.spacing.sm,
                    borderRadius: theme.radius.md,

                    paddingLeft: theme.spacing.xl,
                    paddingRight: theme.spacing.xl,

                    minHeight: max_height * 0.95
                })}
            >
                <Title
                    order={1}
                    sx={{ fontSize: 45 }}
                >
                    Article Title
                </Title>

                <Title
                    order={2}
                    mb={"md"}
                    sx={(theme) => ({
                        color: theme.colors.dark[2],
                        fontSize: 30
                    })}
                >
                    Short description for article
                </Title>

                <DocumentAuthor />

                <Image
                    radius={"md"}
                    mt={"md"}
                    fit={"fill"}
                    height={425}
                    src={"https://free4kwallpapers.com/uploads/originals/2020/09/20/cool-geometric-triangular-abstract-wallpaper.jpg"}
                />
                <Text
                    size={"sm"}
                    transform={"uppercase"}
                    color={"dimmed"}
                    align={"center"}
                    mb={"lg"}
                >
                    Caption
                </Text>

                <DocumentRenderer
                    document={document}
                    max_height={max_height}
                />
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