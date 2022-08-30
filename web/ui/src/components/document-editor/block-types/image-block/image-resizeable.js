import React, { useState, useEffect } from 'react'

import { ActionIcon } from '@mantine/core'

import { Resizable } from 're-resizable'
import { GiResize }  from 'react-icons/gi'

const ImageHandle = ({ hovered }) => (
    <ActionIcon
        color={"gray"}
        variant={"filled"}
        sx={{ opacity: hovered ? 1 : 1 }}
    >
        <GiResize 
            size={14} 
            style={{ transform: 'rotate(90deg)' }}
        />
    </ActionIcon>
)

const ResizeableImage = ({ src, hovered }) => {
    const [dims, setDims] = useState({ width: 0, height: 0 })

    function onResizeStop(e, direction, ref, d) {
        setDims({ width: dims.width + d.width, height: dims.height + d.height })
    }

    useEffect(() => {
        const img = new Image()
        img.src   = src

        img.onload = function() {
            let width  = this.width
            let height = this.height

            setDims({ width: width, height: height })
        }
    }, [])

    return (
        <Resizable
            size={{ 
                width: dims.width, 
                height: dims.height 
            }}

            style={{ 
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                paddingTop: 0 
            }}
            
            lockAspectRatio={true}
            onResizeStop={onResizeStop}
            handleComponent={{ bottomRight: <ImageHandle hovered={hovered} /> }}

            enable={{
                top: false,
                topLeft: false,
                topRight: false,
                left: false,
                right: false,
                bottom: false,
                bottomLeft: false,
                bottomRight: true
            }}
        >
        </Resizable>
    )
}

export default ResizeableImage