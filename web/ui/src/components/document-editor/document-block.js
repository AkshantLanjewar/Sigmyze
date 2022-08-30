import React, { useEffect, useState } from 'react'

import { 
    Box,
    ActionIcon,
    useMantineTheme 
} from '@mantine/core'

import { BiGridHorizontal } from 'react-icons/bi'

import TextBlock  from './block-types/text-block/text-block'
import ImageBlock from './block-types/image-block/image-block'
import ChartBlock from './block-types/chart-block/chart-block'

import { multimedia_blocks, text_blocks, ExtractTags } from './menu/menu-components'
import { useClickOutside } from '@mantine/hooks'

const DocumentBlock = ({ block, UpdateNode, CreateBlock, DeleteBlock }) => {
    const [info, setInfo]     = useState({ blockType: "text", blockStyles: {} })
    const [focus, setFocus]   = useState(false)
    const theme               = useMantineTheme()

    const ref = useClickOutside(() => { setFocus(false) })

    function ProcessBlock() {
        let text_tags  = ExtractTags(text_blocks)
        let image_tags = ExtractTags(multimedia_blocks)

        if(text_tags.includes(block.tag))
            setInfo({ blockType: "text" })
        if(image_tags.includes(block.tag))
            setInfo({ blockType: "image" })
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
                width: '100%',
            }}

            onFocus={() => { setFocus(true) }}
            ref={ref}
        >
            <ActionIcon 
                sx={{ 
                    cursor: 'grab',
                    opacity: focus ? 1 : 0
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
                        created={block.created}
                        theme={theme}
                        focus={focus}
                        setFocus={setFocus}
                        UpdateNode={UpdateNode} 
                        CreateBlock={CreateBlock}
                        DeleteBlock={DeleteBlock}
                    />
                )
                : null
            }

            {info.blockType == "image" && block.tag == "img" && (
                <ImageBlock 
                    block={block}
                    data={block.data}
                    UpdateNode={UpdateNode} 
                    CreateBlock={CreateBlock}
                    DeleteBlock={DeleteBlock}
                />
            )}

            {info.blockType == "image" && block.tag == "chart" && (
                <ChartBlock
                    block={block}
                    UpdateNode={UpdateNode} 
                    CreateBlock={CreateBlock}
                    DeleteBlock={DeleteBlock}
                />
            )}
        </Box>
    )
}

export default DocumentBlock