import React, { useState, useEffect } from "react"
import './brand.scoped.scss'

const Brand = ({ expanded, image, text }) => {
    const [useImage, setUseImage] = useState(false)
    useEffect(() => {
        if(image != undefined)
            setUseImage(true)
    }, [image])

    return (
        <div className={`brand ${expanded ? 'expanded' : ''}`}>
            <a>
                <img src={useImage ? image : null} alt={"logo"} />
                <span>{text}</span>
            </a>
        </div>
    )
}

Brand.displayName = "brand"
export default Brand