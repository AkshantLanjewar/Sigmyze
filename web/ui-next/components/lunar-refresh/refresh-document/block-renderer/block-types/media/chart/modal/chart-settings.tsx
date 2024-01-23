import { useCallback, useEffect, useState } from "react"
import { IQuantaIndicatorLoc } from "../../../../../../data-manager/state"
import { IChartLoc, ISerializedNoteChart } from "../../types"
import styles from '../index.module.scss'
import PortableRefreshChart from "../../../../../../refresh-chart/portable"
import { Button, Flex, FocusTrap, Group, Input, Switch } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Blocks } from "../../../../../types"

interface IChartSettingsProps {
    /**
     * Id for the block, used to change the note block
     */
    blockId: string,

    /**
     * These are the indicators that are currently selected
     */
    selectedIndicators: IQuantaIndicatorLoc[] | undefined,

    /**
     * This is the chart that is currently selected
     */
    selected: IChartLoc | undefined,

    /**
     * This is the payload, used for the settings modal
     */
    payload?: ISerializedNoteChart

    /**
     * this is the function to go back to the select step
     */
    previousStep: () => void,

    /**
     * This is the function that updates a blocks content
     */
    updateNoteBlock: (blockId: string, newContent: string) => void,

    /**
     * function to update the active chart
     */
    updateChart: (newChart: ISerializedNoteChart) => void,

    /**
     * This is the function that inserts a RAW new block
     */
    createRawBlock: (type: Blocks) => void,

    /**
     * If there is a payload, this is the close modal function
     */
    cancel?: () => void
}

const ChartSettings: React.FC<IChartSettingsProps> = ({ 
    blockId, 
    selected, 
    selectedIndicators, 
    payload,
    previousStep, 
    updateNoteBlock,
    updateChart,
    createRawBlock,
    cancel
}) => {
    //this is the state to activate the focus trap
    const [focus, { toggle }] = useDisclosure(false)

    //this is the fileId
    const [fileId, setFileId] = useState<string>("")

    //this is the title for the test chart
    const [title, setTitle] = useState<string>("")

    //these are the indicators that are going to be rendered
    const [indicators, setIndicators] = useState<IQuantaIndicatorLoc[]>([])

    //this is whether or not the chart should display the title
    const [showTitle, setShowTitle] = useState<boolean>(true)

    //this is whether or not the xAxis should be hidden
    const [hideXAxis, setHideXAxis] = useState<boolean>(true)

    //this is whether or not to invert the Y Axis
    const [invertYAxis, setInvertYAxis] = useState<boolean>(true)

    //this is whether or not to hide the yAxis
    const [hideYAxis, setHideYAxis] = useState<boolean>(false)

    /**
     * @description
     *  - this is the wrapper for the cancel function
     */
    const cancelWrap = () => {
        if(cancel === undefined)
            return

        cancel()
    }

    /**
     * @description
     *  - this is the function that converts all the data into serializable form and updates the chart to finish the form
     */
    const submit = useCallback(() => {
        let serializedData = {} as ISerializedNoteChart
        serializedData.fileId = fileId
        serializedData.title = title
        serializedData.hideLegend = true
        serializedData.hideXAxis = hideXAxis
        serializedData.hideYAxis = hideYAxis
        serializedData.invertYAxis = invertYAxis
        serializedData.indicators = indicators
        serializedData.showTitle = showTitle
        serializedData.marshalCheck = "swag"

        const serialized = JSON.stringify(serializedData)
        updateNoteBlock(blockId, serialized)
        updateChart(serializedData)

        if(payload === undefined)
            createRawBlock("paragraph")
        else
            cancelWrap()
    }, [
        payload,
        title,
        fileId,
        indicators,
        showTitle,
        hideXAxis,
        invertYAxis,
        hideYAxis,
        updateNoteBlock
    ])

    useEffect(() => {
        toggle()
    }, [])

    useEffect(() => {
        if(selected === undefined)
            return

        setTitle(selected.title)
        setFileId(selected.fileId)
    }, [selected])

    useEffect(() => {
        if(selectedIndicators === undefined)
            return

        setIndicators([ ...selectedIndicators ])
    }, [selectedIndicators])

    //effect that handles the loading of the payload
    useEffect(() => {
        if(payload === undefined)
            return

        setIndicators([ ...payload.indicators ])
        setTitle(payload.title)
        setFileId(payload.fileId)
        setShowTitle(payload.showTitle)
        setHideXAxis(payload.hideXAxis)
        setInvertYAxis(payload.invertYAxis)
        setHideYAxis(payload.hideYAxis)
    }, [payload])

    return (
        <div 
            className={styles.chart__wrapper} 
            style={{ 
                alignItems: "center", 
                flexDirection: "column",
                gap: 25
            }}
        >
            <div className={styles.chart__preview__wrapper}>
                <div className={styles.chart__card} style={{ width: 700, height: 400 }}>
                    <PortableRefreshChart
                        indicators={indicators}
                        width={700}
                        height={400}
                        title={title}
                        hideXAxis={hideXAxis}
                        invertYAxis={invertYAxis}
                        showTitle={showTitle}
                        hideYAxis={hideYAxis}
                    />
                </div>
            </div>

            <div className={styles.settings__wrapper}>
                <div className={styles.settings__title}>Chart Settings</div>

                <div className={styles.settings__container}>
                    <FocusTrap active={focus}>
                        <div>
                            <Input.Wrapper label={"Chart Title"} pl={2.5} mb={20}>
                                <Input
                                    placeholder="Type Chart Title Here"
                                    variant={"filled"}
                                    radius={"xl"}
                                    pt={5}
                                    ml={-5}
                                    value={title}
                                    onChange={(event) => setTitle(event.currentTarget.value)}
                                />
                            </Input.Wrapper>
                        </div>
                    </FocusTrap>

                    <div>
                        <Group grow spacing={10}>
                            <div>
                                <Switch
                                    color={"teal"}
                                    size={"md"}
                                    label={"Display Title"}
                                    checked={showTitle}
                                    onChange={(e) => setShowTitle(e.currentTarget.checked)}
                                    labelPosition="right"
                                    style={{ width: "100%", display: "flex" }}
                                    styles={{ 
                                        body: { width: "100%", flexGrow: 1, justifyContent: "space-between" },
                                        label: { fontWeight: 600, fontSize: 14 } 
                                    }}
                                />
                            </div>

                            <div>
                                <Switch
                                    checked={!hideXAxis}
                                    onChange={(e) => setHideXAxis(!e.currentTarget.checked)}
                                    color={"teal"}
                                    size={"md"}
                                    label={"Show X Axis"}
                                    style={{ width: "100%", display: "flex" }}
                                    styles={{ 
                                        body: { width: "100%", flexGrow: 1, justifyContent: "space-between" },
                                        label: { fontWeight: 600, fontSize: 14 } 
                                    }}
                                />
                            </div>
                        </Group>

                        <Group grow spacing={10} mt={20}>
                            <div>
                                <Switch
                                    checked={invertYAxis}
                                    onChange={(e) => setInvertYAxis(e.currentTarget.checked)}
                                    color={"teal"}
                                    size={"md"}
                                    label={"Invert Y Axis"}
                                    labelPosition="right"
                                    style={{ width: "100%", display: "flex" }}
                                    styles={{ 
                                        body: { width: "100%", flexGrow: 1, justifyContent: "space-between" },
                                        label: { fontWeight: 600, fontSize: 14 } 
                                    }}
                                />
                            </div>

                            <div>
                                <Switch
                                    checked={!hideYAxis}
                                    onChange={(e) => setHideYAxis(!e.currentTarget.checked)}
                                    color={"teal"}
                                    size={"md"}
                                    label={"Show Y Axis"}
                                    style={{ width: "100%", display: "flex" }}
                                    styles={{ 
                                        body: { width: "100%", flexGrow: 1, justifyContent: "space-between" },
                                        label: { fontWeight: 600, fontSize: 14 } 
                                    }}
                                />
                            </div>
                        </Group>
                    </div>
                </div>
            </div>

            <Group position={"center"} pt={10} grow style={{ width: 225, margin: "0 auto" }}>
                <Button 
                    color={"red"}
                    radius={"xl"}
                    onClick={() => payload ? cancelWrap() : previousStep()}
                >
                    {payload
                        ? "Cancel"
                        : "Previous"
                    }
                </Button>

                <Button 
                    color={"indigo"}
                    radius={"xl"}
                    onClick={() => submit()}
                >
                    {payload
                        ? "Save"
                        : "Done"
                    }
                </Button>
            </Group>
        </div>
    )
}

export default ChartSettings