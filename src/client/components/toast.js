import React, { useState, useEffect } from "react"

import { IoMdClose } from "react-icons/io"

function Toast(props) {
    const subject = props.subject
    const message = props.message

    return (
        <div className="toast">
            <div className="header">
                <strong>{subject}</strong>
                <button><IoMdClose /></button>
            </div>

            <div className="body">
                <p>{message}</p>
            </div>
        </div>
    )
}

function Toastbar(props) {
    return (
        <div className="toastbar" style={{display: props.messages.length == 0 ? "none" : "block"}}>
            { props.messages.map((toast) => (
                <Toast subject={toast.subject} message={toast.message} />
            )) }
        </div>
    )
}

export default Toastbar