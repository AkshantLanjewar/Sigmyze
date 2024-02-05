import { MantineColor } from "@mantine/core"

interface IActionMenuAction {
    /**
     * This is the description label for the action menu item
     */
    label: string,

    /**
     * this is the action that will be run on the button click
     */
    action: () => void,

    /**
     * This is the color for the button
     */
    color: MantineColor,

    /**
     * Icon for the button
     */
    icon: React.ReactElement,

    /**
     * testid for the element
     */
    testId?: string
}

export type { IActionMenuAction }