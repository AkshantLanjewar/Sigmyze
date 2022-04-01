import React, { useState, useEffect } from "react"
import './form.scoped.scss'

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

const TextInput = ({ radius, size, type, disabled, invalid, children }) => {
    //elems
    const icon = React.Children.map(children, child => child.type.displayName === 'icon' ? child : null)

    const validRadius = ['sm', 'md', 'lg']
    const validSize   = ['sm', 'md', 'lg']
    const validTypes  = ['email', 'text', 'password']

    const [rad, setRad]            = useState('radius-md')
    const [siz, setSiz]            = useState('size-md')
    const [iType, setType]         = useState('email')
    const [hasIcon, setHasIcon]    = useState(false)
    const [iDisabled, setDisabled] = useState(false)
    const [iInvalid, setInvalid]   = useState(false)

    useEffect(() => {
        if(icon.length != 0)
            setHasIcon(true)
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
            {icon}
            <input 
                className={`${rad} ${siz} ${hasIcon ? 'has-icon' : ''} ${iDisabled ? 'disabled' : ''}`} 
                placeholder={"Your E-Mail"} type={iType} />
        </div>
    )
}

const Icon = ({ children }) => <div className="icon">{children}</div>
Icon.displayName = "icon"
TextInput.Icon = Icon

Element.TextInput = TextInput

Form.Element = Element

export default Form