import React, { useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"

function Modal(props) {
    let viewState = props.viewState
    let small = props.small

    if(viewState)
        document.getElementsByTagName("body")[0].style.overflow = "hidden"
    if(!viewState)
        document.getElementsByTagName("body")[0].style.overflow = "visible"

    const [bodyOffset, setBodyOffset] = useState('0px')
    const bodyRef = React.createRef()
    useEffect(() => {
        let offSet = window.scrollY
        setBodyOffset(`${offSet}px`)
    }, [props.viewState])

    return (
        <div ref={bodyRef}
             style={{
                display: viewState ? "flex" : "none", 
                justifyContent: "center", 
                width: "100%", 
                height: "100%", 
                position: "absolute", 
                bottom: 0,
                top: bodyOffset, 
                zIndex: "4009"}}>
            <div className="absolute-black-bg"></div>

            <div className={`chart-modal ${small ? "sm" : ""}`}>
                <div className="title">
                    <div className="text">{props.title}</div>
                    <span className="close" onClick={() => { props.setViewState(false) }}><IoMdClose /></span>
                </div>

                <div>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Modal