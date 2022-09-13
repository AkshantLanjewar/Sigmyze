import React, { useEffect, useState } from 'react'

import { Box } from '@mantine/core'

import ModalView from './image-modal'
import ImageView from './image-view'

import { usePrevious } from '../../../lib'

const ImageBlock = ({ block, collect_flag, data, UpdateNode, CreateBlock, DeleteBlock }) => {
    const [opened, setOpened] = useState(false)
    const prevOpened          = usePrevious(opened)

    let styles     = block.styles
    let prevStyles = usePrevious(styles)

    const [created, setCreated] = useState(false)
    const [file, setFile]       = useState(null)

    const scaleRef                = React.createRef()
    const [maxWidth, setMaxWidth] = useState(0)

    const [size, setSize]       = useState({ width: 0, height: 0 })
    const [justify, setJustify] = useState("left")

    function CollectStyles() {
        let styles_obj        = {}
        styles_obj['justify'] = justify

        return styles
    }

    function SetStyles() {
        let nJustify = styles['justify']
        let nSize    = styles['size']

        setJustify(nJustify)
        if(nSize != undefined)
            setSize({ ...nSize })
    }

    useEffect(() => {
        let b_created = block.created
        let styles    = block.styles
        if(styles !== undefined)
            SetStyles()

        let currentScale = scaleRef.current
        let clientWidth  = currentScale.clientWidth
        setMaxWidth(clientWidth)

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

    useEffect(() => {
        let o_styles = {}
        let id       = block.id
        
        o_styles['justify'] = justify
        o_styles['size']    = size

        UpdateNode(id, block.tag, { image_data: block.data.image_data, update_image: false }, o_styles)
    }, [justify, size, file])

    useEffect(() => {

    }, [styles])

    function submit() {
        let id            = block.id
        var fileReader    = new FileReader()
        let styles        = CollectStyles()

        fileReader.onload = function(fileLoadedEvent) {
            let data = fileLoadedEvent.target.result

            setOpened(false)
            UpdateNode(id, block.tag, { image_data: data, update_image: true }, styles)
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
            ref={scaleRef}
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
                        maxWidth={maxWidth}
                        block={block}
                        setJustify={setJustify}
                        CreateBlock={CreateBlock}
                        DeleteBlock={DeleteBlock}
                        EditImage={EditImage}
                        size={size}
                        setSize={setSize}
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