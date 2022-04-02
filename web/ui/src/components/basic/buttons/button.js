import React, { useState, useEffect } from 'react'
import './button.scoped.scss'

const Button = ({ grow, widthSize, rounding, sxOnClick, pColor, padding, children, dHover }) => {
    const icon = React.Children.map(children, child => child.type.displayName == 'Icon' ? child : null)
    const text = React.Children.map(children, child => child.type.displayName == 'Text' ? child : null)
    let dropdown = React.Children.map(children, child => child.type.displayName == 'Dropdown' ? child : null)

    const [buttonPadding, setButtonPadding] = useState('md')
    const [color, setColor] = useState('teal')
    const [roundingC, setRounding] = useState('rounding-md')
    const [hover, setHover] = useState(false)
    const [width, setWidth] = useState('auto')
    const [fGrow, setFGrow] = useState(true)

    const validColors = ['teal', 'black', 'purple', 'red', 'blue' ,'transparent']
    const validPadding = ['sm', 'md', 'lg']
    const validRounding = ['rounding-md', 'rounding-lg']
    const validWidth    = ['auto', 'full']

    useEffect(() => {
        if(validRounding.includes(rounding))
            setRounding(rounding)
        if(typeof dHover == 'boolean')
            setHover(dHover)
        if(validWidth.includes(widthSize))
            setWidth(widthSize)
        if(typeof grow == 'boolean')
            setFGrow(grow)
    }, [rounding, dHover, widthSize, grow])

    useEffect(() => {
        if (validColors.includes(pColor))
            setColor(pColor)
    }, [pColor])

    useEffect(() => {
        if (padding == undefined)
            return
        if (validPadding.includes(padding))
            setButtonPadding(padding)
    }, [padding])

    let displayIcon = true
    if (icon == undefined || icon.length == 0)
        displayIcon = false

    let displayText = true
    if (text == undefined || text.length == 0)
        displayText = false

    const [displayDropdown, setDisplayDropdown] = useState(false)

    function handleOnBlur(e) {
        setTimeout(() => {
            setDisplayDropdown(false)
        }, 50)
    }

    function handleOnClick(e) {
        e.preventDefault()
        if (sxOnClick !== undefined)
            sxOnClick(e)
    }

    return (
        <div className={`button-wrap ${fGrow ? 'grow' : ''}`}>
            <button className={`main ${width} ${buttonPadding} ${color} ${roundingC} ${hover ? 'dHover' : ''}`}
                onClick={handleOnClick}
                onFocus={() => { setDisplayDropdown(true) }}
                onBlur={handleOnBlur}>
                {displayIcon ? icon : null}
                {displayText ? text : null}
            </button>

            {displayDropdown ? dropdown : null}
        </div>
    )
}

const Icon = (props) => <div className='icon'>{props.children}</div>
Icon.displayName = 'Icon'
Button.Icon = Icon

const Text = (props) => <div className='text'>{props.children}</div>
Text.displayName = 'Text'

const Title = (props) => <div className='title'>{props.children}</div>
Text.Title = Title
const Symbol = (props) => <div className='symbol'>{props.children}</div>
Text.Symbol = Symbol

Button.Text = Text

const Dropdown = (props) => (
    <div className='button-drop'>
        <div className='inner'>
            {props.children}
        </div>
    </div>
)
Dropdown.displayName = 'Dropdown'

const DropdownItem = ({ sxOnClick, children }) => {
    const icon = React.Children.map(children, child => child.type.displayName == 'DropdownIcon' ? child : null)
    const title = React.Children.map(children, child => child.type.displayName == 'DropdownTitle' ? child : null)
    const symbol = React.Children.map(children, child => child.type.displayName == 'DropdownSymbol' ? child : null)

    function handleOnClick() {
        if (sxOnClick !== undefined)
            sxOnClick()
    }

    return (
        <button className='item' onClick={handleOnClick}>
            <div className='content'>
                {icon}

                <div className='text'>
                    {title}

                    {symbol}
                </div>
            </div>
        </button>
    )
}

const DropdownIcon = (props) => <div className='icon'>{props.children}</div>
DropdownIcon.displayName = 'DropdownIcon'
DropdownItem.DropdownIcon = DropdownIcon

const DropdownTitle = (props) => <div className='title'>{props.children}</div>
DropdownTitle.displayName = 'DropdownTitle'
DropdownItem.DropdownTitle = DropdownTitle

const DropdownSymbol = (props) => <div className='symbol'>{props.children}</div>
DropdownSymbol.displayName = 'DropdownSymbol'
DropdownItem.DropdownSymbol = DropdownSymbol

DropdownItem.displayName = 'Item'
Dropdown.Item = DropdownItem

Dropdown.displayName = 'Dropdown'
Button.Dropdown = Dropdown

Button.displayName = 'Button'
export default Button