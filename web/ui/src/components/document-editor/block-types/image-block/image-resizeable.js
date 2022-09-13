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

const ResizeableImage = ({ src, hovered, maxWidth, size, setSize }) => {
    function onResizeStop(e, direction, ref, d) {
        setSize({ width: size.width + d.width, height: size.height + d.height })
    }

    function SetAspectWidth(width, height) {
        let aspect  = width / height
        let nWidth  = maxWidth
        let nheight = nWidth / aspect

        return { width: nWidth, height: nheight }
    }

    useEffect(() => {
        const img = new Image()
        img.src   = src

        img.onload = function() {
            let width  = this.width
            let height = this.height

            if(width > maxWidth)
                height = SetAspectWidth(width, height)

            if(size.width == 0)
                setSize({ width: width, height: height })
        }
    }, [])

    useEffect(() => {
        let aspect_obj = SetAspectWidth(size.width, size.height)

        if(size.width > maxWidth)
            setSize({ width: aspect_obj.width, height: aspect_obj.height })
    }, [size])

    return (
        <Resizable
            size={{ 
                width: size.width, 
                height: size.height 
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