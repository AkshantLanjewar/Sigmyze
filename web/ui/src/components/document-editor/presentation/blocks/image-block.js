import React from 'react'
import { Image } from "@mantine/core"

const ImageBlockRender = ({ src, width, height }) => {
    return (
        <Image
            width={width}
            height={height}
            src={src}
            radius={"lg"}
        />
    )
}

export default ImageBlockRender