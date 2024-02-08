import { ActionIcon, Tooltip } from "@mantine/core"
import { IconAlignCenter, IconAlignLeft, IconAlignRight } from "@tabler/icons"

interface IBlockAlignSectionProps {
    /*
     * This is the current alignment of the block 
     */
    align: 'left' | 'center' | 'right' | 'justified',

    /*
     * This is the function to update the alignment of the block
     */
    updateAlign: (align: 'left' | 'center' | 'right' | 'justified') => void
}

const BlockAlignSection: React.FC<IBlockAlignSectionProps> = ({ align, updateAlign }) => {
    const alignedLeft = align === "left"
    const alignedRight = align === "right"
    const alignedCenter = align === "center"

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
                    color={alignedLeft ? "indigo" : "dark"}
                    size={28}
                    data-testId={"align::left"}
                    data-active={alignedLeft}
                    variant={alignedLeft ? "filled" : "subtle"}
                    onClick={() => updateAlign('left')}
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
                    color={alignedCenter ? "indigo" : "dark"}
                    size={28}
                    data-testId={"align::center"}
                    data-active={alignedCenter}
                    variant={alignedCenter ? "filled" : "subtle"}
                    onClick={() => updateAlign('center')}
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
                    color={alignedRight ? "indigo" : "dark"}
                    size={28}
                    data-testId={"align::right"}
                    data-active={alignedRight}
                    variant={alignedRight ? "filled" : "subtle"}
                    onClick={() => updateAlign('right')}
                >
                    <IconAlignRight width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>
        </>
    )
}

export default BlockAlignSection
