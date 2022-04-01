import React, { useState, useEffect } from "react"
import './group.scoped.scss'

const Group = ({ marginType, children }) => {
    const validMargin         = ['md', 'sm', 'lg']
    const [margin, setMargin] = useState('margin-md')
    useEffect(() => {
        if(validMargin.includes(marginType))
            setMargin(`margin-${marginType}`)
    }, marginType)

    return (
        <div className={`group ${margin}`}>
            {children}
        </div>
    )
}

export default Group