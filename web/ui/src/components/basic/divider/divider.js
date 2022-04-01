import React, { useEffect, useState } from "react"
import './divider.scoped.scss'

const Divider = ({ label, position = "center" }) => {
    const [pos, setPos] = useState("center")
    const valid_pos = ["center", "right", "left"]

    useEffect(() => {
        if(valid_pos.includes(position))
            setPos(position)
    }, [position])

    return (
        <div className={`divider ${pos}`}>
            <div className="text">
                {label}
            </div>
        </div>
    )
}

export default Divider