import React from "react"
import './modal.scoped.scss'

const Modal = ({ children }) => {
    const button = React.Children.map(children, child => child.type.displayName === 'Button' ? child : null)

    return (
        <div>
            {button}

            <div className='modal-wrapper'>
                <div className="modal">
                    
                </div>
            </div>
        </div>
    )
}

export default Modal