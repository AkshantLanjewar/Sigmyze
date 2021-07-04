import React from "react"
import './modal.scss'

class Modal extends React.Component {
    render() {
        if(!this.props.show) 
            return null

        return (
            <div className="modal">
                <div className="modal-container" style={{maxWidth: this.props.maxWidth + "px"}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Modal