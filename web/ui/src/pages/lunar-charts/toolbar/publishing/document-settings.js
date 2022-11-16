import React, { useState, useRef } from 'react'

import {
    Box,
    Title,
    Text
} from '@mantine/core'

import { useForm } from '@mantine/form'
import { MdTitle } from 'react-icons/md'

import { MIME_TYPES } from '@mantine/dropzone'

import PublishingField from '../../../../components/ui/publishing-field'
import DropdownSelect  from '../../../../components/ui/dropdown-select'
import ImageDropdzone  from '../../../../components/ui/image-dropzone'
import CardPreview     from './card-preview'

const DocumentSettings = ({ }) => {
    const [selected, setSelected] = useState({ icon: null, name: null })
    const openRef = useRef(null)
    const settings = useForm({
        initialValues: {
            title: '',
            subtitle: ''
        }
    })

    function DropHandler(files) {

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
            <Title order={2}>Article Settings</Title>
            <Text 
                color={"dimmed"} 
                size={"lg"}
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
                    <Box mb={"lg"} mt={"xl"}>
                        <ImageDropdzone
                            openRef={openRef}
                            onDrop={DropHandler}
                            accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.gif, MIME_TYPES.svg]}
                            maxSize={30 * 1024 ** 2}
                        />
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
                        items={[]}
                        selectedIcon={selected.icon}
                        selectedName={selected.name}
                    />
                </form>

                <CardPreview />
            </Box>
        </Box>
    )
}

export default DocumentSettings