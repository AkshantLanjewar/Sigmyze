import React, { useState } from 'react'
import {
    Box,
    Dialog,
    Title,
    Text,
    Group,
    LoadingOverlay
} from '@mantine/core'

import DocumentPreview  from "../../toolbar/publishing/document-preview"
import DocumentSettings from "../../toolbar/publishing/document-settings"

import { showNotification } from '@mantine/notifications'

import { GetOrganization } from "../../../../components/lib"
import { connect }         from "react-redux"

import { IoMdConstruct } from 'react-icons/io'
import { GiPartyPopper } from 'react-icons/gi'

const PublishingView = ({ height, document_id, organization, project, user }) => {
    const [articleImage, setArticleImage] = useState(null)
    const [articleTitle, setArticleTitle] = useState({ title: null, subtitle: null })
    const [author, setAuthor]             = useState({ icon: null, name: null, id: null })
    const [pageDialog, setPageDialog]     = useState(false)
    const [loading, setLoading]           = useState(false)
    const [document, setDocument]         = useState(null)

    function Publish() {
        let organizations   = organization.total_organizations
        let organization_id = organization.organization_id
        let organization_   = GetOrganization(organization_id, organizations)

        let has_page = organization_.has_page
        if(!has_page) {
            setPageDialog(true)
            return
        }

        setLoading(true)

        //publish the document
        const postData = {
            published_title: articleTitle.title,
            published_subtitle: articleTitle.subtitle,
            published_date: new Date(),
            published_image: articleImage,
            content: document,

            public_user: {
                username: author.name,
                id: author.id
            }
        }

        let project_id = project.project_id
        let jwtToken   = user.jwtToken
        let url        = `/api/v1/organizations/organization/${organization_id}/projects/${project_id}/publish`

        fetch(url, {
            method: "POST",
            body: JSON.stringify(postData),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` 
            },
        }).then(res => res.json()).then(data => {
            showNotification({
                title: "Article Published",
                message: "Congratulations! Your article has been published. Make sure to check your drive so that it can be sent out into the world!",
                color: 'green',
                autoClose: 5000,
                icon: <GiPartyPopper />
            })

            setLoading(false)
        })
    }

    return (
        <Box
            sx={(theme) => ({
                width: '100%',
                height: '100%',

                paddingLeft: theme.spacing.xl,
                paddingRight: theme.spacing.xl,

                color: theme.colors.dark[0]
            })}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                position: 'relative',
                height: '100%'
            }}>
                <LoadingOverlay visible={loading} overlayBlur={2} />

                <DocumentPreview
                    document_id={document_id}
                    articleImage={articleImage}
                    articleTitle={articleTitle}
                    author={author}
                    setDocument={setDocument}
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

            <Dialog
                opened={pageDialog}
                withCloseButton={true}
                onClose={() => { setPageDialog(false) }}
                size={"lg"}
                radius={"sm"}
            >
                <Group
                    align={'center'}
                    spacing={'sm'}
                    mb={'sm'}
                >
                    <IoMdConstruct size={22} />
                    <Title order={4}>Under Construction</Title>
                </Group>

                <Text size={"sm"} color={"dimmed"}>
                    Unfortunately is not available at the moment.
                    We are working to make this available ASAP.
                </Text>
            </Dialog>
        </Box>
    )
}

const mapDispatchToProps = dispatch => ({

})

const mapStateToProps = state => ({
    organization: state.organization,
    project: state.project,
    user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(PublishingView)