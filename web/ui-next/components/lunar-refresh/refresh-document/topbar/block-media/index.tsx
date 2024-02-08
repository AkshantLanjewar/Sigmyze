import { ActionIcon, Tooltip } from "@mantine/core"
import { IconCameraPlus, IconChartPie } from "@tabler/icons"
import { useEffect, useState } from "react"
import { Blocks, INoteBlock } from "../../types"
import { getBlockType } from "./util"

interface IBlockMediaSectionProps {
    /**
     * this is the active block within the editor
     */
    activeBlock: string | undefined,

    /**
     * These are the blocks that are rendered within the editor
     */
    blocks: INoteBlock[],

    /*
     * this is the function that handles the changing of the requested note block
     */
    changeNoteBlock: (blockId: string, newTypes: Blocks, newContent: string) => void,
}

const BlockMediaSection: React.FC<IBlockMediaSectionProps> = ({ activeBlock, blocks, changeNoteBlock }) => {
    //this is the state that holds the type of the active block 
    const [type, setType] = useState<Blocks | undefined>(undefined)

    //this is the effect that gets the type 
    useEffect(() => {
        if(activeBlock === undefined)
            return

        let newType = getBlockType(activeBlock, blocks) 
        if(newType === undefined)
            return

        setType(newType)
    }, [activeBlock, blocks])

    //bool test for chart 
    const isChart = type === "media::chart"
    //bool test for image 
    const isImage = type === "media::image"

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
                    color={isChart ? "indigo" : "dark"}
                    variant={isChart ? "filled" : "subtle"}
                    size={28}
                    data-testId={"media::chart"}
                    onClick={() => {
                        if(activeBlock === undefined)
                            return 

                        changeNoteBlock(activeBlock, "media::chart", "")
                    }}
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
                    color={isChart ? "indigo" : "dark"}
                    variant={isChart ? "filled" : "subtle"}
                    size={28}
                    data-testId={"media::image"}
                    onClick={() => {
                        if(activeBlock === undefined)
                            return 

                        changeNoteBlock(activeBlock, "media::image", "")
                    }}
                >
                    <IconCameraPlus width={"80%"} height={"80%"} stroke={2.5} />
                </ActionIcon>
            </Tooltip>
        </>
    )
}

export default BlockMediaSection
