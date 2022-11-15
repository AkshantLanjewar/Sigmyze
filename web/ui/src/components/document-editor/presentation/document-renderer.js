import React, { useEffect, useState } from 'react'

import {
    Box,
    Title,
    Text
} from '@mantine/core'

import ChartRender      from "../block-types/chart-block/chart-render"
import ImageBlockRender from "./blocks/image-block"

const DocumentRenderer = ({ document }) => {
    const [rendered, setRendered] = useState([])

    function BlockAlign(style, block) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: style['justify']
                }}
            >
                {block}
            </Box>
        )
    }

    let titleTags = ["h1", "h2", "h3", "h4", "h5", "h6"]

    useEffect(() => {
        if(document == null)
            return

        let documentContent = document.document_content
        let blocks = []
        for(let i = 0; i < documentContent.length; i++) {
            let block  = documentContent[i]
            let tag    = block['tag']
            let blockStyles = block['styles']
            let block_ = null

            if(tag == "img") {
                let width  = blockStyles['size']['width']
                let height = blockStyles['size']['height']
                let data   = block['data']['image_data']

                block_ = (
                    <ImageBlockRender
                        width={width}
                        height={height}
                        src={data}
                    />
                )
            } else if (titleTags.includes(tag)) {
                let order = parseInt(tag.split("h")[1])
                let text  = block['html'].replace(/(<|&lt;)br\s*\/*(>|&gt;)/g,' ')

                block_ = (
                    <Title order={order}>{text}</Title>
                )
            } else if (tag == "p") {
                let text  = block['html'].replace(/(<|&lt;)br\s*\/*(>|&gt;)/g,' ').replace('&nbsp;', '')

                block_ = (
                    <Text>{text}</Text>
                )
            } else if (tag == "chart") {
                if(block['data']['indicators'] == null)
                    continue
                if(block['data']['indicators'].length == 0)
                    continue

                let styles = block['styles']
                block_ = (
                    <ChartRender
                        block={block}
                        useJustify={true}
                        justify={styles['justify']}
                    />
                )
            }

            blocks.push(BlockAlign(blockStyles, block_))
        }

        setRendered([...blocks])
    }, [document])

    return (
        <Box>
            {rendered}
        </Box>
    )
}

export default DocumentRenderer