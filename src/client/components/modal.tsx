import React from "react"

type ModalProps = {
    maxWidth: number,
    show: boolean
}

const Modal: React.FC<ModalProps> = ({maxWidth, show, children}) => {
    if(show) {
        return (
            <div className="modal">
                <div className="modal-container" style={{maxWidth: maxWidth + "px"}}>
                    {children}
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default Modal