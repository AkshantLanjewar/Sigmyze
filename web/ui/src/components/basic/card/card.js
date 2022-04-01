import React from "react"
import './card.scoped.scss'

const Card = ({ minWidth, children }) => {
    if(minWidth == undefined)
        minWidth = 450

    return (
        <div className="card" style={{ minWidth: `${minWidth}px` }}>
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