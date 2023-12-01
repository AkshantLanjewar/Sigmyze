import { Button, Group, GroupPosition, MantineColor, MantineNumberSize, MantineSize } from "@mantine/core"

interface IRenderedButton {
    /**
     * This is the method that will be called when the button is clicked
     */
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,

    /**
     * This is the color of the button
     */
    color: MantineColor,

    /**
     * This is the size of the button
     */
    size: MantineSize

    /**
     * Whether or not the button is disabled
     */
    disabled: boolean,

    /**
     * The radius of the button
     */
    radius: MantineNumberSize,

    /**
     * The display for the button
     */
    display: string,

    /**
     * the test id for the button
     */
    testId: string
}

interface IButtonRendererProps {
    /**
     * The buttons that are going to be rendered
     */
    buttons: IRenderedButton[],

    /**
     * This is the spacing for the group, defaults to sm
     */
    spacing?: MantineNumberSize,

    /**
     * The position for the group, defaults to center
     */
    position?: GroupPosition
}

const ButtonRenderer: React.FC<IButtonRendererProps> = ({ buttons, spacing, position }) => {
    return (
        <Group 
            position={position ? position : "center"}
            spacing={spacing ? spacing : 'sm'}
        >
            {buttons.map((step, index) => (
                <Button
                    key={`rendered-button-${index}`}
                    onClick={(e) => step.onClick(e)}
                    color={step.color}
                    size={step.size}
                    disabled={step.disabled ? step.disabled : false}
                    radius={step.radius}
                    data-testId={step.testId}
                >
                    {step.display}
                </Button>
            ))}
        </Group>
    )
}

export type { IRenderedButton }
export default ButtonRenderer