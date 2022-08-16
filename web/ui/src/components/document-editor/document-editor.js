import React, { useEffect, useState }   from 'react'
import { Box, useMantineTheme }               from '@mantine/core'
import { v4 as uuidv4 }      from 'uuid'
import DocumentBlock         from './document-block'
import GenerateTextStyles    from './text-generator'

const inital_block = { id: uuidv4(), html: "", tag: "h1" }

const DocumentEditor = ({ }) => {
    const [blocks, setBlocks] = useState([])
    const theme               = useMantineTheme()

    function UpdateNode(id, tag, data) {
        let n_blocks = []

        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]

            let text_tags = GenerateTextStyles(theme, "p")[1]
            if(text_tags.includes(tag) && id == block.id) {
                block['html']   = data['text'].trim()
                block['tag']    = tag
            }

            n_blocks.push(block)
        }

        setBlocks([...n_blocks])
    }

    function CreateBlock(id) {
        let newBlock = { id: uuidv4(), html: "", tag: "p" }
    }

    useEffect(() => {
        setBlocks([...[inital_block]])
    }, [])
    
    return (
        <Box
            sx={(theme) => ({
                color: theme.colors.dark[0],
                paddingLeft: theme.spacing.xl,
                paddingRight: theme.spacing.xl
            })}
        >
            {blocks.map((step, key) => (
                <DocumentBlock 
                    key={key}
                    block={step} 
                    UpdateNode={UpdateNode}
                />
            ))}
        </Box>
    )
}

export default DocumentEditor