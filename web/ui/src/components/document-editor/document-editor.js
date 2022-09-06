import React, { useEffect, useState }   from 'react'
import { Box, ScrollArea }   from '@mantine/core'
import { v4 as uuidv4 }      from 'uuid'
import DocumentBlock         from './document-block'

import { multimedia_blocks, text_blocks, ExtractTags } from './menu/menu-components'

const DocumentEditor = ({ scale_change }) => {
    const [blocks, setBlocks] = useState([])
    const [height, setHeight] = useState(0)
    const [width, setWidth]   = useState(0)

    const ref          = React.createRef()
    const inital_block = { id: uuidv4(), html: "", tag: "h1", data: {}, collect_flag: false }

    function UpdateNode(id, tag, data) {
        let n_blocks   = []
        let text_tags  = ExtractTags(text_blocks)
        let image_tags = ExtractTags(multimedia_blocks)

        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]

            if(text_tags.includes(tag) && id == block.id) {
                block['html']   = data['text'].trim()
                block['tag']    = tag
            }

            if(image_tags.includes(tag) && id == block.id) {
                block['created'] = true
                if('update_image' in data)
                    block['created'] = false
                if('size' in data)
                    block['data']['size'] = data['size']

                block['tag']     = tag
                block['data']    = data
            }

            n_blocks.push(block)
        }

        setBlocks([...n_blocks])
    }

    function CreateBlock(id) {
        let oBlocks  = blocks
        let newBlock = { id: uuidv4(), html: "", tag: "p", data: {}, created: true }
        let index_p  = 0

        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.id == id)
                index_p = i
            if(block.created)
                block['created'] = false
            oBlocks[i] = block
        }

        oBlocks.splice(index_p + 1, 0, newBlock)
        setBlocks([...oBlocks])
    }

    function SetStyles(id, styles) {
        let f_block = {}
        let f_index = 0

        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.id == id)
                f_index = i
        }

        f_block           = blocks[f_index]
        f_block['styles'] = styles

        let n_blocks      = blocks
        n_blocks[f_index] = f_block
        setBlocks([...n_blocks])
    }

    function DeleteBlock(id) {
        let f_block = {}
        let f_index = 0

        function GenericBlock() {
            return {
                id: f_block.id,
                created: false,
                data: {},
                html: "",
                tag: "h1"
            }
        }

        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.id == id) {
                f_block = block
                f_index = i
            }
        }

        let tag_flag = f_block.tag == "img" || f_block.tag == "chart"
        if(f_index == 0 && blocks.length == 1 && tag_flag) {
            setBlocks([GenericBlock()])
            return
        }

        let nBlocks = blocks.splice(f_index, 1)
        if(nBlocks.length == 0)
            nBlocks = [GenericBlock()]

        setBlocks([...nBlocks])
    }

    function Scale() {
        let rect  = ref.current.getBoundingClientRect()
        let width = 8.5 * 96

        setWidth(width)
        setHeight(rect.height - 16)
    }

    useEffect(() => {
        Scale()
        setBlocks([inital_block])
    }, [])

    useEffect(() => {
        Scale()
    }, [scale_change])
    
    return (
        <Box
            ref={ref}
            sx={(theme) => ({
                color: theme.colors.dark[0],
                paddingLeft: theme.spacing.xl,
                paddingRight: theme.spacing.xl,
                paddingBottom: theme.spacing.md,
                height: "100%",

                display: 'flex',
                flexDirection: "column",
                justifyContent: "center",
                alignItems: 'center',
            })}
        >
            <ScrollArea 
                style={{ 
                    height: height, 
                    width: width ,
                    position: 'static',
                }}

                styles={{ viewport: {
                    display: 'flex',
                    flexDirection: "column",
                    gap: 5,
                }}}

                offsetScrollbars
                type={'hover'}
            >
                {blocks.map((step, key) => (
                    <DocumentBlock 
                        key={`${key}-${step.id}`}
                        block={step} 
                        collect_flag={step.collect_flag}
                        UpdateNode={UpdateNode}
                        CreateBlock={CreateBlock}
                        DeleteBlock={DeleteBlock}
                        SetStyles={SetStyles}
                    />
                ))}
            </ScrollArea>
        </Box>
    )
}

export default DocumentEditor