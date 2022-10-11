import React, { useEffect, useState }   from 'react'
import { Box, ScrollArea }   from '@mantine/core'
import { v4 as uuidv4 }      from 'uuid'
import DocumentBlock         from './document-block'

import { multimedia_blocks, text_blocks, ExtractTags } from './menu/menu-components'

import { connect }            from 'react-redux'
import { SetDocumentContent } from '../../data/actions/projectActions'

const DocumentEditor = ({ data_location, scale_change, set_document_content, project }) => {
    const [blocks, setBlocks] = useState([])
    const [height, setHeight] = useState(0)
    const [width, setWidth]   = useState(0)

    const ref          = React.createRef()
    const inital_block = { id: uuidv4(), html: "", tag: "h1", data: {} }

    function UpdateNode(id, tag, data, styles) {
        let n_blocks   = []
        let text_tags  = ExtractTags(text_blocks)
        let image_tags = ExtractTags(multimedia_blocks)

        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            
            if(id == block.id)
                block['styles'] = styles

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

        set_document_content([...n_blocks], data_location)
        setBlocks([...n_blocks])
    }

    function CreateBlock(id) {
        let oBlocks  = blocks
        let newBlock = { id: uuidv4(), html: "", tag: "p", data: {}, created: true, styles: { justify: 'left' } }
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

        set_document_content(oBlocks, data_location)
        setBlocks([...oBlocks])
    }

    //DEPRECATED FUNCTION
    function SetStyles(id, styles) {}

    function DeleteBlock(id) {
        let f_block = null

        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.id == id)
                f_block = blocks[i]
        }

        let generic_block = {
            id: f_block.id,
            created: false,
            data: {},
            html: "",
            tag: "h1"
        }

        let tag_flag = f_block.tag == "img" || f_block.tag == "chart"
        if(blocks.length == 1 && tag_flag) {
            setBlocks([generic_block])
            return
        }

        let nBlocks = []
        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]

            if(block.id == id && i > 0)
                nBlocks[i - 1]['created'] = true

            if(block.id != id)
                nBlocks.push(block)
        }

        if(nBlocks.length == 0)
            nBlocks = [generic_block]

        set_document_content(nBlocks, data_location)
        setBlocks([...nBlocks])
    }

    function Scale() {
        let rect  = ref.current.getBoundingClientRect()
        let width = 8.5 * 96

        setWidth(width)
        setHeight(rect.height - 16)
    }

    useEffect(() => {
        let n_blocks  = [inital_block]
        let documents = project.project_data.documents

        for(let i = 0; i < documents.length; i++) {
            let document = documents[i]

            if(document.data_location == data_location) {
                let content = document.document_content
                if(Array.isArray(content))
                    n_blocks = content
            }
        }

        Scale()
        setBlocks([...n_blocks])
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
                        collect_flag={false}
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

const mapStateToProps = state => ({
    project: state.project
})

const mapDispatchToProps = dispatch => ({
    set_document_content: (blocks, document_location) => dispatch(SetDocumentContent(blocks, document_location))
})

export default connect(mapStateToProps, mapDispatchToProps)(DocumentEditor)