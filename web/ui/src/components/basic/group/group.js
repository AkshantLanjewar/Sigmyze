import React from "react"
import './group.scoped.scss'

const Group = ({ children }) => {
    return (
        <div className="group">
            {children}
        </div>
    )
}

export default Group