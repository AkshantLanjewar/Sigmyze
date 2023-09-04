import React from "react"

interface IPortalButton {
    buttonColor: string, //this is the hex color
    buttonIcon: React.ReactElement,
    buttonId: string,
    onClick: () => void
}

export type {
    IPortalButton
}