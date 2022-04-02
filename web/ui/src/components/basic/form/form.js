import React, { useState, useEffect } from "react"
import './form.scoped.scss'

import Button from '../buttons/button'

const Form = ({ children }) => {
    return (
        <form className="form">
            <div className="inner">
                {children}
            </div>
        </form>
    )
}

const Element = ({ children }) => {
    return (
        <div className="element">
            {children}
        </div>
    )
}

//create the different element types
const Label = ({ children, target }) => <label htmlFor={target}>{children}</label>
Element.Label = Label

const TextInput = ({ radius, size, type, disabled, invalid, placeholder, children }) => {
    //elems
    const icon   = React.Children.map(children, child => child.type.displayName === 'icon' ? child : null)
    const r_icon = React.Children.map(children, child => child.type.displayName === 'button' ? child : null)

    const validRadius = ['sm', 'md', 'lg']
    const validSize   = ['sm', 'md', 'lg']
    const validTypes  = ['email', 'text', 'password']

    const [rad, setRad]            = useState('radius-md')
    const [siz, setSiz]            = useState('size-md')
    const [iType, setType]         = useState('email')
    const [hasIcon, setHasIcon]    = useState(true)
    const [iDisabled, setDisabled] = useState(false)
    const [iInvalid, setInvalid]   = useState(false)

    useEffect(() => {
        if(icon == undefined)
            setHasIcon(false)
    }, [icon])

    useEffect(() => {
        if(validRadius.includes(radius))
            setRad(`radius-${radius}`)
        if(validSize.includes(size))
            setSiz(`size-${size}`)
        if(validTypes.includes(type))
            setType(type)
        if(typeof disabled == 'boolean')
            setDisabled(disabled)
        if(typeof invalid == 'boolean')
            setInvalid(invalid)
    }, [radius, size, type, disabled, invalid])


    return (
        <div className={`input-wrapper ${iInvalid ? 'invalid' : ''}`}>
            {hasIcon ? icon : null}
            <input 
                className={`${rad} ${siz} ${hasIcon ? 'has-icon' : ''} ${iDisabled ? 'disabled' : ''}`} 
                placeholder={placeholder} type={iType} />
            {r_icon}
        </div>
    )
}

const Icon = ({ children }) => <div className="form-icon">{children}</div>
Icon.displayName = "icon"
TextInput.Icon = Icon

const RightButton = ({ sxOnClick, children }) => {
    function HandleOnClick(e) {
        e.preventDefault()

        if(sxOnClick !== undefined)
            sxOnClick()
    }

    return (
        <div className="right">
            <Button padding={"sm"} pColor={"transparent"} dHover={true} sxOnClick={HandleOnClick} widthSize={"full"}>
                <Button.Icon>{children}</Button.Icon>
            </Button>
        </div>
    )
}
RightButton.displayName = "button"
TextInput.RightButton = RightButton

const CheckBoxInput = ({ labelVal }) => {
    const [checked, setChecked] = useState(false)
    function CheckClicked(e) {
        e.preventDefault()
        setChecked(!checked)
    }

    return (
        <div className="checkbox-wrapper">
            <div className="checkbox">
                <input type={"checkbox"} checked="" onClick={CheckClicked} className={`${ checked ? 'visible' : '' }`} />
                <svg viewBox="0 0 10 7" fill="none" className={`${ checked ? 'visible' : '' }`}>
                    <path
                        d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule={"evenodd"} />
                </svg>
            </div>

            <label>{labelVal}</label>
        </div>
    )
}

Element.CheckBoxInput = CheckBoxInput
Element.TextInput     = TextInput
Form.Element          = Element

export default Form