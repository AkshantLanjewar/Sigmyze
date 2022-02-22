import React, { useEffect, useState } from "react"
import { IoMdClose } from "react-icons/io"

function Modal(props) {
    let viewState = props.viewState
    let small = props.small
    let large = props.large

    const [bodyOffset, setBodyOffset] = useState('0px')
    const bodyRef = React.createRef()
    useEffect(() => {
        let offSet = window.scrollY
        setBodyOffset(`${offSet}px`)

        if(viewState)
            document.getElementsByTagName("body")[0].style.overflow = "hidden"
        if(!viewState)
            document.getElementsByTagName("body")[0].style.overflow = "visible"
    }, [props.viewState])

    return (
        <div ref={bodyRef}
             style={{
                display: viewState ? "flex" : "none", 
                justifyContent: "center", 
                width: "100vw", 
                height: "100%", 
                position: "absolute", 
                bottom: 0,
                top: bodyOffset, 
                left: 0,
                zIndex: "20000"}}>
            <div className="absolute-black-bg" onClick={() => { props.setViewState(false) }}></div>

            <div className={`chart-modal ${small ? "sm" : ""} ${large ? "lg" : ""}`}>
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