import { ActionIcon, Tooltip } from "@mantine/core"
import { IconBold, IconItalic, IconStrikethrough } from "@tabler/icons"

interface ITextStyleSectionProps {

}

const TextStyleSection: React.FC<ITextStyleSectionProps> = ({ }) => {
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
                    color={"dark"}
                    size={28}
                    data-testId={"text::bold"}
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
                    color={"dark"}
                    size={28}
                    data-testId={"text::italic"}
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
                    color={"dark"}
                    size={28}
                    data-testId={"text::strikethru"}
                >
                    <IconStrikethrough width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>
        </>
    )
}

export default TextStyleSection