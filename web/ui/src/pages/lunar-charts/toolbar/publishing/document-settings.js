import React, { useState, useRef, useEffect } from 'react'

import {
    Box,
    Title,
    Text,
    Avatar,
    Menu,
    Group,
    Button,
    ScrollArea,
    Image,
    ActionIcon
} from '@mantine/core'

import { useForm } from '@mantine/form'
import { MdTitle } from 'react-icons/md'
import { TbX }     from 'react-icons/tb'

import { MIME_TYPES } from '@mantine/dropzone'

import PublishingField from '../../../../components/ui/publishing-field'
import DropdownSelect  from '../../../../components/ui/dropdown-select'
import ImageDropdzone  from '../../../../components/ui/image-dropzone'
import CardPreview     from './card-preview'

import { SetOrganizations } from '../../../../data/actions/organizationActions'
import { 
    GenerateInitials,
    ImageBase64 
} from '../../../../components/lib'

import { connect }  from 'react-redux'
import { AsyncGet } from '../../../../components/lib'

import { showNotification } from '@mantine/notifications'

const DocumentSettings = 
    ({ height, articleImage, setArticleImage, setArticleTitle, setAuthor, user, organization, SetOrganizations, Publish }) => {
    const [selected, setSelected] = useState({ icon: null, name: null, id: null, type: null })
    const [items, setItems]       = useState([])
    const [date, setDate]         = useState(new Date())

    const openRef = useRef(null)
    const settings = useForm({
        initialValues: {
            title: '',
            subtitle: ''
        }
    })

    function DropHandler(files) {
        let file = files[0]
        
        ImageBase64(file, setArticleImage)
    }

    useEffect(() => {
        setArticleTitle({ title: settings.values.title, subtitle: settings.values.subtitle })
    }, [settings.values])

    useEffect(() => {
        async function main() {
            let author_options = []

            let user_option = {}
            user_option['initials'] = GenerateInitials(user['username'])
            user_option['name']     = user['username']
            user_option['type']     = 'user'
            user_option['id']       = 'user'
            author_options.push(user_option)

            let organizations   = organization.total_organizations
            let organization_id = organization.organization_id
            let organization_    = null
            
            let jwtToken = user.jwtToken
            let url    = "/api/v1/organizations"
            let params = {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                }
            }

            let data      = await AsyncGet(url, params)
            organizations = data['organizations']
            SetOrganizations(organizations)

            for(let i = 0; i < organizations.length; i++) {
                let organization__ = organizations[i]
                if(organization__.organization_id == organization_id)
                    organization_ = organization__
            }

            if(organization_ !== null) {
                let organization_option         = {}
                organization_option['initials'] = GenerateInitials(organization_['organization_name'])
                organization_option['name']     = organization_['organization_name']
                organization_option['id']       = organization_['organization_id']
                organization_option['type']     = 'organization'
                author_options.push(organization_option)
            }

            let items = []
            for(let i = 0; i < author_options.length; i++) {
                let option = author_options[i]
                let icon   = (
                    <Avatar size={"sm"}>
                        {option['initials']}
                    </Avatar>
                )

                let item   = (
                    <Menu.Item
                        key={`document-creator-${option['name']}`}
                        icon={icon}
                        onClick={ () => { 
                            setSelected({ icon: icon, ...option })  
                            setAuthor({ icon: icon, ...option })
                        }}
                    >
                        {option['name']}
                    </Menu.Item>
                )

                items.push(item)
                if(i == 0) {
                    setSelected({ icon: icon, ...option })  
                    setAuthor({ icon: icon, ...option })
                }
            }

            setItems([...items])
        }

        main()
    }, [])

    function OnPublishClick(e) {
        e.preventDefault()

        let title = settings.values.title
        let subt  = settings.values.subtitle
        let flag  = false

        if(title.length == 0) {
            showNotification({
                title: "Sigmyze Publishing",
                message: "You need to have a title to publish an article",
                color: 'red',
                autoClose: 3500
            })

            flag = true
        } 

        if(subt.length == 0) {
            showNotification({
                title: "Sigmyze Publishing",
                message: "You need to have a subtitle to publish an article",
                color: 'red',
                autoClose: 3500
            })

            flag = true
        }

        if(flag)
            return

        Publish()
    }

    return (
        <Box
            sx={(theme) => ({
                height: '100%',
                padding: theme.spacing.md,
                maxWidth: 500,

                display: 'flex',
                flexDirection: 'column'
            })}
        >
            <ScrollArea
                sx={{ height: height }} 
                offsetScrollbars
            >
                <Group
                    position='apart'
                    align={"center"}
                >
                    <Title order={2}>Article Settings</Title>

                    <Button color={"indigo"} onClick={OnPublishClick}>
                        Publish
                    </Button>
                </Group>

                <Text 
                    color={"dimmed"} 
                    size={"lg"}
                    mt={'sm'}
                    mb={"lg"}
                >
                    Almost there!
                    Just add the final touches and you are ready to go!
                </Text>

                <Box 
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <form>
                        <Box 
                            mb={"lg"} 
                            mt={"xl"}
                            sx={{ height: 225 }}
                        >
                            {articleImage == null
                                ? (
                                    <ImageDropdzone
                                        openRef={openRef}
                                        onDrop={DropHandler}
                                        accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.gif, MIME_TYPES.svg]}
                                        maxSize={30 * 1024 ** 2}
                                    />
                                )
                                : (
                                    <Box sx={{ position: 'relative' }} >
                                        <Image
                                            height={225}
                                            radius={"md"}
                                            fit={"fill"}
                                            src={articleImage}
                                        />

                                        <ActionIcon
                                            sx={{
                                                position: 'absolute',
                                                right: 10,
                                                top: 10
                                            }}

                                            color={'red'}
                                            variant={'filled'}
                                            onClick={() => { setArticleImage(null) }}
                                        >
                                            <TbX size={16} />
                                        </ActionIcon>
                                    </Box>
                                )
                            }
                        </Box>

                        <PublishingField 
                            icon={ <MdTitle size={16} stroke={1.5} /> }
                            label={"Article Title"}
                            name={"title"}
                            form={settings}
                        />

                        <PublishingField 
                            icon={ <MdTitle size={16} stroke={1.5} /> }
                            label={"Short Description of Article"}
                            name={"subtitle"}
                            form={settings}
                        />
                        
                        <Title 
                            order={5} 
                            mt={'md'}
                            align={'center'}
                            sx={{ marginBottom: -15 }}
                        >
                            Author
                        </Title>

                        <DropdownSelect
                            u_width={85}
                            radius={"sm"}
                            items={items}
                            selectedIcon={selected.icon}
                            selectedName={selected.name}
                        />
                    </form>

                    <CardPreview 
                        articleTitle={settings.values.title}
                        articleImage={articleImage}
                        author={selected}
                        date={date}
                    />
                </Box>
            </ScrollArea>
        </Box>
    )
}

const mapDispatchToProps = dispatch => ({
    SetOrganizations: (organizations) => dispatch(SetOrganizations(organizations))
})

const mapStateToProps = state => ({
    user: state.user,
    organization: state.organization
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentSettings)