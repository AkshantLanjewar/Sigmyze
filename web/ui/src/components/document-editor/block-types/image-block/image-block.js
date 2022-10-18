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

    const [flag, setFlag]       = useState(false)
    const [size, setSize]       = useState({ width: 0, height: 0 })
    const [justify, setJustify] = useState("left")

    function CollectStyles() {
        let styles_obj        = {}
        styles_obj['justify'] = justify
        styles_obj['size']    = size

        return styles
    }

    function SetStyles() {
        if(styles == undefined)
            return

        let nJustify = styles['justify']
        let nSize    = styles['size']

        setJustify(nJustify)
        if(nSize != undefined && nSize.width > 0 && nSize.height > 0)
            setSize({ ...nSize })
    }

    function SetAspectWidth(width, height) {
        let aspect  = width / height
        let nWidth  = maxWidth
        let nheight = nWidth / aspect

        if(isNaN(nheight))
            return

        return { width: nWidth, height: nheight }
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
        let img      = new Image()
        img.src      = img_data

        img.onload = function() {
            if(block['styles']['size']['width'] == 0) {
                let width  = this.width
                let height = this.height

                if(width > maxWidth) {
                    let obj = SetAspectWidth(width, height)
                
                    width  = obj.width
                    height = obj.height
                }

                setSize({ width: width, height: height })
            }

            if(img_data !== undefined)
                setCreated(true)
        }
    }, [maxWidth])

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
        
    }, [size])

    useEffect(() => {
        if(styles == undefined)
            return

        let width = styles['size']
        if(width == undefined)
            return
    }, [styles])

    function submit() {
        let id            = block.id
        var fileReader    = new FileReader()
        let styles        = CollectStyles()

        fileReader.onload = function(fileLoadedEvent) {
            let data = fileLoadedEvent.target.result

            setOpened(false)
            setCreated(true)
            UpdateNode(id, block.tag, { image_data: data, update_image: true }, styles)
            setFlag(!flag)
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
                        SetAspectWidth={SetAspectWidth}
                        block={block}
                        setJustify={setJustify}
                        CreateBlock={CreateBlock}
                        DeleteBlock={DeleteBlock}
                        EditImage={EditImage}
                        size={size}
                        setSize={setSize}
                        flag={flag}
                    />
                )
                : (
                    <ModalView
                        opened={opened}
                        setOpened={setOpened}
                        file={file}
                        setFile={setFile}
                        submit={submit}
                        setSize={setSize}
                        SetAspectWidth={SetAspectWidth}
                    />
                )
            }
        </Box>
    )
}

export default ImageBlock