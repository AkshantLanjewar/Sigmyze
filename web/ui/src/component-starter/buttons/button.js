import React from 'react'
import './button.scoped.scss'

const Button = ({ children }) => {
    let subComponentList = Object.keys(Button)

    let subComponents = subComponentList.map((key) => {
        return React.Children.map(children, (child) =>
            child.type.name === key ? child : null
        )
    })

    return (
        <div className='button-wrap'>
            <button>
                {subComponents.map((component) => component)}
            </button>

            <div className='button-drop'>
                AA
            </div>
        </div>
    )
}

const Icon = (props) => <div className='icon'>{props.children}</div>
Button.Icon = Icon

const Text = (props) => <div className='text'>{props.children}</div>
Button.Text = Text

export default Button