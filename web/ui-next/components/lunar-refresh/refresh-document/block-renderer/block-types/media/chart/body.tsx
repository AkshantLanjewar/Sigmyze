import { useEffect, useState } from "react"
import { ISerializedNoteChart } from "../types"
import styles from './index.module.scss'
import { IQuantaXYPos } from "../../../../../../quanta/quanta-editor/types/nodes"
import PortableRefreshChart from "../../../../../refresh-chart/portable"
import { useClickOutside } from "@mantine/hooks"
import ActionMenu from "../media-action-menu"
import { IconTrash, IconWriting } from "@tabler/icons"
import { Blocks } from "../../../../types"
import ChartDeleteModal from "./modal/delete"
import ChartSettingsModal from "./modal/settings-modal"
import ResizeableWrapper from "../resizeable-wrapper"


interface IChartBodyProps {
    /**
     * blockId for the block
     */
    blockId: string

    /**
     * This is the chart being rendered
     */
    chart: ISerializedNoteChart,

    /**
     * whether or not there is a focus request within the editor
     */
    hasRequest: boolean,

    /**
     * This is the function that consumes a focus request
     */
    consumeFocusRequest: (blockId: string) => boolean,
    
    /**
     * This is the function that deletes a block from the renderer
     */
    deleteNoteBlock: (blockId: string) => void,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * function to update the active chart
     */
    updateChart: (newChart: ISerializedNoteChart) => void,

    /**
     * This is the function that sets the active block for focus purposes
     */
    setActiveBlockState: (blockId: string) => void
}

const ChartBody: React.FC<IChartBodyProps> = ({ 
    blockId, 
    chart, 
    hasRequest, 
    consumeFocusRequest, 
    deleteNoteBlock, 
    updateNoteBlock, 
    updateChart,
    setActiveBlockState 
}) => {
    //whether or not the chart is active
    const [active, setActive] = useState<boolean>(false)

    //click outside ref
    const ref = useClickOutside(() => {
        setActive(false)  
    })

    //these are the dimensions for the chart
    const [dims, setDims] = useState<IQuantaXYPos>({ x: 600, y: 300 })

    //this is the state that will handle the toggling of the delete modal
    const [deleteToggle, setDeleteToggle] = useState<boolean>(false)
    //this is the function that toggles the delete modal
    const toggleDeleteModal = () => setDeleteToggle(!deleteToggle)

    //this is the state that will handle the toggling of the settings modal
    const [settingsToggle, setSettingsToggle] = useState<boolean>(false)
    //this is the function that toggles the settings modal
    const toggleSettingsModal = () => setSettingsToggle(!settingsToggle)

    useEffect(() => {
        if(hasRequest === false || consumeFocusRequest(blockId) === false)
            return

        setActive(true)
    }, [hasRequest])

    //this is the effect that sets the active block state when the chart is active
    useEffect(() => {
        if(active === false)
            return

        setActiveBlockState(blockId)
    }, [active, blockId])

    return (
        <div 
            className={`${styles.body__wrapper}`} 
            ref={ref}
            onClick={() => setActive(true)}
            data-testId={'chart-block-body'}
        >
            <ResizeableWrapper
                dims={dims}
                maintainAspectRatio={true}
                hovered={active}
                setDims={setDims}
            >
                <div 
                    className={`${styles.body__chart} ${active ? styles.active : null}`}
                    style={{ width: active ? dims.x + 5 : dims.x, height: active ? dims.y + 5 : dims.y }}
                >
                    <ChartSettingsModal
                        toggle={settingsToggle}
                        blockId={blockId}
                        chart={chart}
                        updateNoteBlock={updateNoteBlock}
                        updateChart={updateChart}
                    />

                    <ChartDeleteModal
                        toggle={deleteToggle}
                        blockId={blockId}
                        deleteNoteBlock={deleteNoteBlock}
                    />

                    <PortableRefreshChart
                        indicators={chart.indicators}
                        width={dims.x}
                        height={dims.y}
                        title={chart.title}
                        hideXAxis={chart.hideXAxis}
                        hideYAxis={chart.hideYAxis}
                        showTitle={chart.showTitle}
                        invertYAxis={chart.invertYAxis}
                        customBg="#141517"
                    />

                    <ActionMenu
                        focused={active}
                        actions={[
                            {
                                label: "Edit Chart",
                                icon: <IconWriting size={18} />,
                                color: "gray",
                                action: () => toggleSettingsModal()
                            },
                            {
                                label: "Delete Chart",
                                icon: <IconTrash size={18} />,
                                color: "red",
                                testId: "delete-chart",
                                action: () => toggleDeleteModal()
                            }
                        ]}
                    />
                </div>
            </ResizeableWrapper>
        </div>
    )
}

export default ChartBody