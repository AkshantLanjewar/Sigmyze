import React, { useEffect, useState }   from 'react'
import { Box, ScrollArea }   from '@mantine/core'
import { v4 as uuidv4 }      from 'uuid'
import DocumentBlock         from './document-block'

import { image_blocks, text_blocks, ExtractTags } from './menu/menu-components'

const DocumentEditor = ({ }) => {
    const [blocks, setBlocks] = useState([])
    const [height, setHeight] = useState(0)
    const [width, setWidth]   = useState(0)

    const ref          = React.createRef()
    const inital_block = { id: uuidv4(), html: "", tag: "h1", data: {} }

    function UpdateNode(id, tag, data) {
        let n_blocks   = []
        let text_tags  = ExtractTags(text_blocks)
        let image_tags = ExtractTags(image_blocks)

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
                block['data']    = { image_data: data['image_data'] }
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

    function DeleteBlock(id) {
        let nBlocks = []
        if(blocks.length == 1)
            return

        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]

            if(block.created)
                block['created'] = false
            if(block.id !== id)
                nBlocks.push(block)
            if(block.id == id) {
                let prev_index                 = i - 1 == -1 ? 0 : i - 1
                nBlocks[prev_index]['created'] = true
            }
        }

        setBlocks([...nBlocks])
    }

    useEffect(() => {
        let rect = ref.current.getBoundingClientRect()
        setWidth(rect.width - 48)
        setHeight(rect.height - 16)

        setBlocks([inital_block])
    }, [])
    
    return (
        <Box
            ref={ref}
            sx={(theme) => ({
                color: theme.colors.dark[0],
                paddingLeft: theme.spacing.xl,
                paddingRight: theme.spacing.xl,
                paddingBottom: theme.spacing.md,
                height: "100%"
            })}
        >
            <ScrollArea 
                style={{ 
                    height: height, 
                    width: width ,
                    position: 'static'
                }}

                styles={{ viewport: {
                    display: 'flex',
                    flexDirection: "column",
                    gap: 5
                }}}

                offsetScrollbars
                type={"always"}
            >
                {blocks.map((step, key) => (
                    <DocumentBlock 
                        key={`${key}-${step.id}`}
                        block={step} 
                        UpdateNode={UpdateNode}
                        CreateBlock={CreateBlock}
                        DeleteBlock={DeleteBlock}
                    />
                ))}
            </ScrollArea>
        </Box>
    )
}

export default DocumentEditor