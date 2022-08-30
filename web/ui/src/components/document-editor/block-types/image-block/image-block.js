import React, { useEffect, useState } from 'react'

import { Box } from '@mantine/core'

import ModalView from './image-modal'
import ImageView from './image-view'

import { usePrevious } from '../../../lib'

const ImageBlock = ({ block, data, UpdateNode, CreateBlock, DeleteBlock }) => {
    const [opened, setOpened] = useState(false)
    const prevOpened          = usePrevious(opened)

    const [created, setCreated] = useState(false)
    const [file, setFile]       = useState(null)
    const [justify, setJustify] = useState("left")

    useEffect(() => {
        let b_created = block.created

        if(b_created)
            setOpened(true)
    }, [])

    useEffect(() => {
        let img_data = block['data']['image_data']
        if(img_data !== undefined)
            setCreated(true)
    }, [data])

    useEffect(() => {
        if(opened == false && prevOpened == true && file == null)
            DeleteBlock(block.id)
    }, [opened])

    function submit() {
        let id            = block.id
        var fileReader    = new FileReader()
        fileReader.onload = function(fileLoadedEvent) {
            let data = fileLoadedEvent.target.result

            setOpened(false)
            UpdateNode(id, block.tag, { image_data: data, update_image: true })
        }

        fileReader.readAsDataURL(file)
    }

    function EditImage() {
        setFile(null)
        setCreated(false)
        
        setOpened(true)
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",

                justifyContent: justify
            }}
        >
            {created == true
                ? (
                    <ImageView
                        block={block}
                        setJustify={setJustify}
                        CreateBlock={CreateBlock}
                        DeleteBlock={DeleteBlock}
                        EditImage={EditImage}
                    />
                )
                : (
                    <ModalView
                        opened={opened}
                        setOpened={setOpened}
                        file={file}
                        setFile={setFile}
                        submit={submit}
                    />
                )
            }
        </Box>
    )
}

export default ImageBlock