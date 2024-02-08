import { ActionIcon, Tooltip } from "@mantine/core"
import { IconBold, IconItalic, IconStrikethrough } from "@tabler/icons"

interface ITextStyleSectionProps {
    /*
     * Whether or not the active block is bold 
     */
    bold: boolean,

    /*
     * Whether or not the active block is italicized
     */
    italic: boolean,
    
    /*
     * Whether or not the active block is struck through 
     */
    strike: boolean,

    /*
     * This is the function to unbold a block 
    */
    toggleBoldOff: () => void,

    /*
     * This is the function that bolds a block
    */
    toggleBoldOn: () => void,

    /*
     * This is the function to toggle italic's on 
     */
    toggleItalicOn: () => void,

    /*
     * This is the function to toggle italic's off 
     */
    toggleItalicOff: () => void

    /*
     * this is the function to toggle strike thru on 
     */
    toggleStrikethruOn: () => void

    /*
     * this is the function to toggle struke thru off 
     */
    toggleStrikethruOff: () => void
}

const TextStyleSection: React.FC<ITextStyleSectionProps> = ({ 
    bold, 
    italic, 
    strike,
    toggleBoldOff, 
    toggleBoldOn, 
    toggleItalicOn, 
    toggleItalicOff,
    toggleStrikethruOn,
    toggleStrikethruOff
}) => {
    /*
     * This is the function that handles when the bold button is clicked
     */
    const boldClick = () => {
        if(bold === true)
            toggleBoldOff()
        else
            toggleBoldOn()
    }

    /*
     * This is the function that handles when the italic button is clicked
     */
    const italicClick = () => {
        if(italic === true)
            toggleItalicOff()
        else
            toggleItalicOn()
    }

    const strikeClick = () => {
        if(strike === true)
            toggleStrikethruOff()
        else
            toggleStrikethruOn()
    }

    return (
        <>
            <Tooltip
                withArrow
                color={"dark"}
                label={"Bold Text"}
                styles={{ tooltip: { backgroundColor: "#08090A" } }}
                openDelay={250}
                transition={"slide-down"}
                position={"bottom"}
            >
                <ActionIcon
                    variant={bold ? "filled" : "subtle"}
                    color={bold ? "indigo" : "dark"}
                    size={28}
                    data-testId={"text::bold"}
                    onClick={() => boldClick()}
                    data-active={bold}
                >
                    <IconBold width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>

            <Tooltip
                withArrow
                color={"dark"}
                label={"Italicize Text"}
                styles={{ tooltip: { backgroundColor: "#08090A" } }}
                openDelay={250}
                transition={"slide-down"}
                position={"bottom"}
            >
                <ActionIcon
                    color={italic ? "indigo" : "dark"}
                    size={28}
                    data-active={italic}
                    data-testId={"text::italic"}
                    onClick={() => italicClick()}
                    variant={italic ? "filled" : "subtle"}
                >
                    <IconItalic width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>

            <Tooltip
                withArrow
                color={"dark"}
                label={"Italicize Text"}
                styles={{ tooltip: { backgroundColor: "#08090A" } }}
                openDelay={250}
                transition={"slide-down"}
                position={"bottom"}
            >
                <ActionIcon
                    color={strike ? "indigo" : "dark"}
                    size={28}
                    data-testId={"text::strikethru"}
                    variant={strike ? "filled" : "subtle"}
                    onClick={() => strikeClick()}
                    data-active={strike}
                >
                    <IconStrikethrough width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>
        </>
    )
}

export default TextStyleSection
