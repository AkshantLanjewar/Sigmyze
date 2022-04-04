import React, { useState, useEffect } from "react"
import './group.scoped.scss'

const Group = ({ gapSize, type, marginType, children }) => {
    const validMargin         = ['md', 'sm', 'lg']
    const [margin, setMargin] = useState('margin-md')

    const validType        = ['row', 'column']
    const [vType, setType] = useState('row')

    const validGap      = ['sm', 'md', 'lg']
    const [gap, setGap] = useState('gap-md')

    useEffect(() => {
        if(validMargin.includes(marginType))
            setMargin(`margin-${marginType}`)
        if(validType.includes(type))
            setType(type)
        if(validGap.includes(gapSize))
            setGap(`gap-${gapSize}`)
    }, [marginType, type, gapSize])

    return (
        <div className={`group ${margin} ${vType} ${gap}`}>
            {children}
        </div>
    )
}

export default Group