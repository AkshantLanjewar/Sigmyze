import React, { useEffect, useState } from 'react'

import { 
    Box,
    Text,
    SimpleGrid,
    Group,
    ActionIcon,
    Tooltip 
} from '@mantine/core'

import { connect }           from 'react-redux'
import { ToggleDriveUpdate } from '../../../../../data/actions/driveActions'

import ProjectShell  from './project-shell'
import ArticleReview from './modals/article-review'

import { HiDocumentText }     from 'react-icons/hi'
import { MdOutlineOpenInNew } from 'react-icons/md'
import { AiOutlineStop }      from 'react-icons/ai'

const OrganizationQueue = ({ drive, organization, user, ToggleDriveUpdate }) => {
    const [taskQueue, setTaskQueue]             = useState([])
    const [opened, setOpened]                   = useState(false)
    const [selectedArticle, setSelectedArticle] = useState(null)

    let published_queue = drive.published_queue

    useEffect(() => {
        let articleQueue = []
        
        for(let i = 0; i < published_queue.length; i++) {
            let article = published_queue[i]

            let slot = (
                <Group 
                    spacing={'xs'}
                    position={'right'}
                >
                    <Tooltip
                        withArrow
                        position={'bottom'}
                        label={'Deny'}
                        color={'dark'}
                    >
                        <ActionIcon 
                            color={'red'} 
                            onClick={() => { DenyArticle(article.published_id, {}) }}
                        >
                            <AiOutlineStop size={18} />
                        </ActionIcon>
                    </Tooltip>
        
                    <Tooltip
                        withArrow
                        position={'bottom'}
                        label={'Open'}
                        color={'dark'}
                    >
                        <ActionIcon 
                            color={'indigo'}
                            onClick={() => { ReviewArticle(article.published_id) }}
                        >
                            <MdOutlineOpenInNew size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            )

            let articleTask = (
                <ProjectShell
                    title={article.published_title}
                    type={"Article"}
                    icon={<HiDocumentText />}
                    menu={slot}
                />
            )

            articleQueue.push(articleTask)
        }

        let n_tasks = [...articleQueue]
        setTaskQueue([...n_tasks])
    }, [published_queue])

    function DenyArticle(published_id, functions) {
        let jwt_token       = user.jwtToken
        let organization_id = organization.organization_id
        if(organization_id == null)
            return

        let setLoading = null
        if('setLoading' in functions)
            setLoading = functions['setLoading']
        if(setLoading !== null)
            setLoading(true)

        let url = `/api/v1/organizations/organization/${organization_id}/deny/${published_id}`
        fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${jwt_token}` 
            }
        }).then(data => {
            ToggleDriveUpdate()
            if(setLoading !== null)
                setLoading(false)
        })
    }

    function ReviewArticle(published_id) {
        let article = null

        for(let i = 0; i < published_queue.length; i++) {
            let article_ = published_queue[i]
            if(article_.published_id == published_id)
                article = article_
        }

        if(article == null)
            return

        setSelectedArticle(article)
        setOpened(true)
    }

    return (
        <Box>
            <ArticleReview 
                opened={opened}
                setOpened={setOpened}
                article={selectedArticle}
                DenyArticle={DenyArticle}
            />

            {drive.working_directory == "root" && drive.published_queue.length > 0
                ? (
                    <Box mb={'xl'} pb={'xl'}>
                        <Text
                            size={"sm"}
                            color={"dimmed"}
                            transform={"uppercase"}
                        >
                            Organization Tasks
                        </Text>

                        <SimpleGrid
                            cols={6}
                            spacing={"md"}
                            mt={"sm"}
                        >
                            {taskQueue}
                        </SimpleGrid>
                    </Box>
                )

                : null
            }
        </Box>
    )
}

const mapStateToProps = state => ({
    drive: state.drive,
    organization: state.organization,
    user: state.user
})

const mapDispatchToProps = dispatch => ({
    ToggleDriveUpdate: () => { dispatch(ToggleDriveUpdate()) }
})

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationQueue)