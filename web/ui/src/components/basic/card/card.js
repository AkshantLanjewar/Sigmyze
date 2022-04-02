import React from "react"
import './card.scoped.scss'

const Card = ({ minWidth, maxWidth, children }) => {
    if(minWidth == undefined)
        minWidth = 450
    if(maxWidth == undefined)
        maxWidth = 450

    return (
        <div className="card" style={{ minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px` }}>
            {children}
        </div>
    )
}

const TextRow = ({ children }) => (
    <div className="text-row">
        {children}
    </div>
)

Card.TextRow = TextRow

export default Card