import { ActionIcon, Tooltip } from "@mantine/core"
import { IconAlignCenter, IconAlignLeft, IconAlignRight } from "@tabler/icons"

interface IBlockAlignSectionProps {

}

const BlockAlignSection: React.FC<IBlockAlignSectionProps> = ({ }) => {
    return (
        <>
            <Tooltip
                withArrow
                color={"dark"}
                label={"Align Left"}
                styles={{ tooltip: { backgroundColor: "#08090A" } }}
                openDelay={250}
                transition={"slide-down"}
                position={"bottom"}
            >
                <ActionIcon 
                    color={"dark"}
                    size={28}
                    data-testId={"align::left"}
                >
                    <IconAlignLeft width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>

            <Tooltip
                withArrow
                color={"dark"}
                label={"Align Center"}
                styles={{ tooltip: { backgroundColor: "#08090A" } }}
                openDelay={250}
                transition={"slide-down"}
                position={"bottom"}
            >
                <ActionIcon 
                    color={"dark"}
                    size={28}
                    data-testId={"align::center"}
                >
                    <IconAlignCenter width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>

            <Tooltip
                withArrow
                color={"dark"}
                label={"Align Right"}
                styles={{ tooltip: { backgroundColor: "#08090A" } }}
                openDelay={250}
                transition={"slide-down"}
                position={"bottom"}
            >
                <ActionIcon 
                    color={"dark"}
                    size={28}
                    data-testId={"align::right"}
                >
                    <IconAlignRight width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>
        </>
    )
}

export default BlockAlignSection