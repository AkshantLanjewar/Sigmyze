import { ActionIcon, Tooltip } from "@mantine/core"
import { IconCameraPlus, IconChartPie } from "@tabler/icons"

interface IBlockMediaSectionProps {

}

const BlockMediaSection: React.FC<IBlockMediaSectionProps> = ({ }) => {
    return (
        <>
            <Tooltip
                withArrow
                color={"dark"}
                label={"Add Chart"}
                styles={{ tooltip: { backgroundColor: "#08090A" } }}
                openDelay={250}
                transition={"slide-down"}
                position={"bottom"}
            >
                <ActionIcon 
                    color={"dark"}
                    size={28}
                    data-testId={"media::chart"}
                >
                    <IconChartPie width={"80%"} height={"80%"} stroke={2.5} fill='#c1c2c5' />
                </ActionIcon>
            </Tooltip>

            <Tooltip
                withArrow
                color={"dark"}
                label={"Add Image"}
                styles={{ tooltip: { backgroundColor: "#08090A" } }}
                openDelay={250}
                transition={"slide-down"}
                position={"bottom"}
            >
                <ActionIcon 
                    color={"dark"}
                    size={28}
                    data-testId={"media::image"}
                >
                    <IconCameraPlus width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>
        </>
    )
}

export default BlockMediaSection