import React, { useEffect, useState } from 'react'

import { 
    Box,
    ActionIcon,
    useMantineTheme 
} from '@mantine/core'

import { BiGridHorizontal } from 'react-icons/bi'
import GenerateTextStyles   from './text-generator'

import TextBlock from './block-types/text-block'

const DocumentBlock = ({ block, UpdateNode }) => {
    const [info, setInfo]     = useState({ blockType: "text", blockStyles: {} })
    const theme               = useMantineTheme()
    let contentRef            = React.createRef()

    function ProcessBlock() {
        let block_type = block.tag
        let block_text = GenerateTextStyles(theme, block_type)[0]

        if(block_text.text) {
            setInfo({ blockType: "text", blockStyles: block_text.styles })
        }
    }

    useEffect(() => {
        ProcessBlock()
    }, [block.html, block.tag, block])

    useEffect(() => {
        ProcessBlock()
    }, [])

    return (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',

                width: '100%'
            }}
        >
            <ActionIcon 
                sx={{ 
                    cursor: 'grab'
                }}
                mr={'xs'}
            >
                <BiGridHorizontal />
            </ActionIcon>

            {info.blockType == "text"
                ? (
                    <TextBlock 
                        html={block.html} 
                        tag={block.tag} 
                        id={block.id}
                        theme={theme}
                        UpdateNode={UpdateNode} 
                    />
                )
                : null
            }
        </Box>
    )
}

export default DocumentBlock