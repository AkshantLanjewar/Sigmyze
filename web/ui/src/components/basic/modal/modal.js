import React, { useState, useEffect } from "react"
import { RiCloseFill } from 'react-icons/ri'

import './modal.scoped.scss'

const Modal = ({ modalState, setModalState, children }) => {
    const button = React.Children.map(children, child => child.type.displayName === 'Button' ? child : null)
    const title  = React.Children.map(children, child => child.type.displayName === 'ModalTitle' ? child : null)
    const body   = React.Children.map(children, child => child.type.displayName === 'ModalBody' ? child : null)

    //check if undefined
    const [displayButton, setDisplayButton] = useState(false)
    const [displayTitle, setDisplayTitle]   = useState(false)
    const [displayBody, setDisplayBody]     = useState(false)
    
    useEffect(() => {
        if(button.length != 0)
            setDisplayButton(true)
        if(displayTitle.length != 0)
            setDisplayTitle(true)
        if(body.length > 0)
            setDisplayBody(true)
    }, [children])

    const [modalActive, setModalActive] = useState(false)
    useEffect(() => {
        if(typeof modalState == 'boolean')
            setModalActive(modalState)
    }, [modalState])

    function HandleSXClick() {
        if(setModalState == undefined)
            setModalActive(true)
        else
            setModalState(true)
    }

    function CloseModal() {
        if(setModalState == undefined)
            setModalActive(false)
        else
            setModalState(false)
    }

    return (
        <div>
            { displayButton ? React.cloneElement(button[0], { sxOnClick: HandleSXClick }) : null}

            <div className={`modal-wrapper ${modalActive ? 'active-modal' : 'closed-modal'}`}>
                <div className="modal">
                    { displayTitle ? React.cloneElement(title[0], { closeFunc: CloseModal }) : null }
                    {displayBody ? React.cloneElement(body[0], {  }) : null}
                </div>

                <div className="modal-background" onClick={CloseModal}>

                </div>
            </div>
        </div>
    )
}

const Title = ({ closeFunc, children }) => (
    <div className="title-row">
        <div className="text">{children}</div>

        <button className="close" onClick={closeFunc}>
            <RiCloseFill />
        </button>
    </div>
)
Title.displayName = "ModalTitle"
Modal.Title = Title

const Body = ({ children }) => (
    <div className="body">
        {children}
    </div>
)
Body.displayName = "ModalBody"
Modal.Body = Body

export default Modal