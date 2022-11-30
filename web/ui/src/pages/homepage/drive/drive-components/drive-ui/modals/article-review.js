import React, { useState } from 'react'

import { 
    Box,
    Modal,
    Group,
    Button 
} from '@mantine/core'

import ArticleView from '../../../../../../components/document-editor/presentation/article-view'

import { connect }           from 'react-redux'
import { ToggleDriveUpdate } from '../../../../../../data/actions/driveActions'
import { showNotification }  from '@mantine/notifications'

import { HiStatusOnline } from 'react-icons/hi'

const ArticleReview = 
    ({ user, organization, opened, setOpened, article, DenyArticle, ToggleDriveUpdate, hideControls }) => {
    const [denyLoading, setDenyLoading]       = useState(false)
    const [publishLoading, setPublishLoading] = useState(false)

    function Publish() {
        setPublishLoading(true)

        let jwt_token       = user.jwtToken
        let organization_id = organization.organization_id
        let published_id    = article.published_id

        let url = `/api/v1/organizations/organization/${organization_id}/approve/${published_id}`
        fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${jwt_token}` 
            }
        }).then(data => {
            ToggleDriveUpdate()
            setPublishLoading(false)
            setOpened(false)
            
            //create the notification
            showNotification({
                title: "Sigmyze Publishing",
                message: "Your article is now live!",
                color: 'green',
                autoClose: 10000,
                icon: <HiStatusOnline />
            })
        })
    }

    return (
        <Box>
            <Modal
                opened={opened}
                onClose={() => { setOpened(false) }}
                title={"Final Review"}
                size={"auto"}
                centered
            >
                {article !== null && (
                    <ArticleView article={article} />
                )}

                {hideControls
                    ? null
                    : (
                        <Group position={'center'} mt={'md'}>
                            <Button 
                                variant='outline' 
                                color={'red'}
                                loaderPosition={'center'}
                                loading={denyLoading}
                                sx={{ width: 90 }}
                                onClick={() => { 
                                    DenyArticle(article.published_id, { setLoading: setDenyLoading }) 
                                    setOpened(false)
                                }}
                            >
                                Deny
                            </Button>

                            <Button 
                                color={'indigo'}
                                loaderPosition={'center'}
                                loading={publishLoading}
                                sx={{ width: 90 }}
                                onClick={() => { Publish() }}
                            >
                                Publish
                            </Button>
                        </Group>
                    )
                }
            </Modal>
        </Box>
    )
}

const mapStateToProps = state => ({
    organization: state.organization,
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    ToggleDriveUpdate: () => dispatch(ToggleDriveUpdate())
})

export default connect(mapStateToProps, mapDispatchToProps)(ArticleReview)