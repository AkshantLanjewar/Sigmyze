import React from "react"

/**
 * This is the dataset structure defintion for the portal buttons rendered in the side-navbar
 */
interface IPortalButton {
    /**
     * this is the color in hex for the button.
     * NOTE: do not add the #, just put the numbers in, ex: C1C2C5
     */
    buttonColor: string, //this is the hex color

    /**
     * This is the icon that will be rendered within the portal button.
     * NOTE: Provide a react component, ex: <ExampleIcon />
     */
    buttonIcon: React.ReactElement,

    /**
     * NOTE: this field is mainly used for testing purposes.
     * The value of this field will be the test-id of the buttonIcon element.
     */
    buttonId: string,

    /**
     * NOTE: This field needs to be hydrated.
     * This is the function that ends up being called whenever the portal button is clicked.
     */
    onClick: () => void,

    /**
     * NOTE: This field is optional, and is not critical to the functioning of the portal button.
     * This is the definition for if the portal button activates a menu or not.
     */
    portalMenu?: IPortalButtonMenu,

    /**
     * NOTE: This field is optional and is not needed for a functioning portal button.
     * This determines whether or not the portal button is disabled or not
     */
    disabled?: boolean
}

/**
 * this is the datastructure definition for the menu in a portal button
 */
interface IPortalButtonMenu {
    /**
     * this is the title for the portal menu, being displayed above all the menu items
     */
    menuTitle: string,

    /**
     * NOTE: This field is for testing purposes only.
     * This is the testId that will be attached to the menu container, not the portal button.
     */
    testId?: string

    /**
     * theese are the menu items to be rendered within the portal button menu
     */
    menuButtons: IPortalButtonMenuButton[],
}

/**
 * This is the datastructure definition for a portal menu button
 */
interface IPortalButtonMenuButton {
    /**
     * this is the title of the button, it has the larger font size within the portal menu component.
     */
    buttonName: string,

    /**
     * this is the description of the button's action, it has the smaller font size within the portal menu component.
     */
    buttonDescription: string,

    /**
     * this is the icon for the portal menu button.
     * NOTE: provide an actual react element, like so, ex: <ExampleIcon />
     */
    buttonIcon: React.ReactElement,

    /**
     * NOTE: This field is for testing purposes only.
     * This is the testId attached to the component's icon.
     */
    testId?: string,

    /**
     * NOTE: This is an internal field, not meant for component use, but rather external function use.
     * This is whether or not the portal button was hydrated.
     */
    hydrated?: boolean,

    /**
     * NOTE: This needs to be hydrated.
     * This is the function that gets called when the portal menu button gets clicked.
     */
    onClick: () => void  
}

export type {
    IPortalButton,
    IPortalButtonMenu,
    IPortalButtonMenuButton
}