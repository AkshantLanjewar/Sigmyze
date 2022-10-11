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

const ResizeableImage = ({ src, hovered, maxWidth, size, setSize, SetAspectWidth }) => {
    function onResizeStop(e, direction, ref, d) {
        setSize({ width: size.width + d.width, height: size.height + d.height })
    }

    function SetImageSize() {
        let img = new Image()
        img.src = src

        img.onload = function() {
            let width  = this.width
            let height = this.height

            if(width > maxWidth) {
                let obj = SetAspectWidth(width, height)

                width  = obj.width
                height = obj.height
            }

            if(size.width == 0)
                setSize({ width: width, height: height })
        }
    }

    useEffect(() => {
        SetImageSize()
    }, [])

    useEffect(() => {
        let aspect_obj = SetAspectWidth(size.width, size.height)
        if(aspect_obj == undefined)
            return

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