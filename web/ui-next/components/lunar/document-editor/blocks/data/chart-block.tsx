import { ActionIcon, Group, UnstyledButton } from "@mantine/core"
import { useClickOutside, useHover } from "@mantine/hooks"
import { IconEdit, IconGripVertical, IconPlus, IconTrash } from "@tabler/icons"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IActionMenuItem, IDocumentBlock } from "../../../../data/lunar/types/document-types"
import { ChartDims } from "../../../chart-view/engine/types"
import ActionMenu from "../action-menu"
import ResizableWrapper from "../resizable-wrapper"
import DocumentChart from "./document-chart"

interface IChartBlockProps {
    block: IDocumentBlock,
    createBlockWrapper: (callback: () => void) => void,
    deleteBlockWrapper: () => void,
    setActiveModal: Dispatch<SetStateAction<string | null>>,
    updateSizeWrapper: (dims: ChartDims | null) => void,
}

const ChartBlock: React.FC<IChartBlockProps> = 
    ({ block, createBlockWrapper, deleteBlockWrapper, updateSizeWrapper, setActiveModal }) => {
    const [active, setActive] = useState(false)
    const [dims, setDims] = useState<ChartDims | null>(null)

    const { hovered, ref } = useHover()
    const clickRef = useClickOutside<HTMLDivElement>(() => { setActive(false) })

    //action menu definition
    const ChartActionMenu = [
        {
            icon: <IconPlus size={20} />,
            label: "Add Block",
            cb: () => { createBlockWrapper(() => setActive(false)) }
        },
        {
            icon: <IconEdit size={20} />,
            label: "Edit Image",
            cb: () => { editChartWrapper() }
        },
        {
            icon: <IconTrash color={'#fa5252'} size={20} />,
            label: "Delete Chart",
            cb: () => { deleteBlockWrapper() }
        }
    ] as IActionMenuItem[]

    useEffect(() => {
        if(block.width === undefined || block.height === undefined)
            return

        let nDims = { x: block.width, y: block.height } as ChartDims
        setDims({ ...nDims })
    }, [block])

    function setDims_(value: ChartDims) {
        setDims(value)
        updateSizeWrapper(value)
    }

    //wrapper function to edit the image
    function editChartWrapper() {
        setActiveModal("create_chart")
    }

    return (
        <div>
            <Group
                noWrap={true}
                spacing={"xs"} 
                align={"center"}
                position={'center'}
                ref={ref}
                mb={'md'}
            >
                <ActionIcon
                    variant={"transparent"}
                    color={"dark"}
                    radius={"sm"}
                    size={"xs"}
                    sx={{ opacity: hovered ? 1 : 0 }}
                >
                    <IconGripVertical />
                </ActionIcon>

                {dims && (
                    <ResizableWrapper
                        dims={dims}
                        setDims={setDims_}
                        maintainAspectRatio={true}
                        hovered={hovered}
                    >
                        <UnstyledButton
                            onClick={() => { setActive(true) }}
                            sx={{ width: "100%", height: '100%' }}
                        >
                            {block.chartData && (
                                <DocumentChart
                                    data={block.chartData.presentationData}
                                    title={block.chartData.title}
                                    caption={block.chartData.caption}
                                    dims={dims}
                                />
                            )}
                        </UnstyledButton>

                        <ActionMenu
                            active={active}
                            items={ChartActionMenu}
                            ref={clickRef}
                        />
                    </ResizableWrapper>
                )}

                <ActionIcon
                    variant={"transparent"}
                    color={"dark"}
                    radius={"sm"}
                    size={"xs"}
                    sx={{ opacity: 0, pointerEvents: 'none' }}
                />
            </Group>
        </div>
    )
}

export default ChartBlock