import styles from './create-modal.module.scss'
import { Avatar, Box, Button, Checkbox, Group, Input, Modal, Select, Stack, Text } from "@mantine/core"
import DocumentChart from "../blocks/data/document-chart"
import { forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { LunarContextData } from '../../../data/lunar/context'
import { ILunarProjectData, ILunarState, IProjectNode } from '../../../data/lunar/types/types'
import { IPresentationChart } from '../blocks/types'
import { IconGraph } from '@tabler/icons'
import { SelectItem } from '@mantine/core/lib/Select'
import { useForm } from '@mantine/form'
import { usePrevious } from '@mantine/hooks'
import { ICreateMediaBlockData } from '../document-block'
import { IChartBlockData, MediaTypes, TextTypes } from '../../../data/lunar/types/document-types'
import { QuantaDatasetManagerData } from '../../../ui/quanta-dataset-manager'
import { IDatasetManagerState } from '../../../ui/quanta-dataset-manager/types'

interface ISelectItem extends React.ComponentPropsWithoutRef<'div'> {
    value: string,
    label: string,
    subtext: string
}
//this is the component for the item that is in the selectmenu
const SelectItem = forwardRef<HTMLDivElement, ISelectItem>(
    ({ value, label, subtext, ...others }: ISelectItem, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar>
                    <IconGraph />
                </Avatar>

                <div>
                    <Text size={'sm'}>{label}</Text>
                    <Text size="xs" opacity={0.65}>
                        {subtext}
                    </Text>
                </div>
            </Group>
        </div>
    )
)

function ExtractCharts(splits: IProjectNode[]) {
    let charts = [] as IProjectNode[]
    for(let i = 0; i < splits.length; i++) {
        let split = splits[i]
        if(split.node_type === "chart")
            charts.push(split)

        let childCharts = ExtractCharts(split.children)
        charts = [...charts, ...childCharts]
    }

    return charts
}

//function to extract all the charts from the project
function ExtractChartsWrapper(data: ILunarProjectData | null | undefined) {
    if(data === null || data === undefined)
        return []

    let splits = data.splits
    return ExtractCharts(splits)
}

interface ICreateChartModalProps {
    active: boolean,
    close: () => void,
    createBlock: (type: TextTypes | MediaTypes, data: ICreateMediaBlockData) => void,
}

const CreateChartModal: React.FC<ICreateChartModalProps> = ({ active, close, createBlock }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const [items, setItems] = useState<ISelectItem[]>([])
    const [chartObjects, setChartObjects] = useState<IPresentationChart[]>([])
    const [chartObject, setChartObject] = useState<IPresentationChart | undefined>(undefined)
    const [selectedChart, setSelectedChart] = useState<string | null>(null)

    const { fetchIndicatorText } = useContext(QuantaDatasetManagerData) as IDatasetManagerState

    //formdata
    const form = useForm({
        initialValues: {
            useDefaultTitle: true,
            title: '',
            caption: ''
        }
    })

    //function to validate the form
    function validateForm() {
        if(chartObject === undefined)
            return false

        let title = form.values.title
        if(title.length === 0)
            return false

        return true
    }

    //reset the modal state
    function reset() {
        form.reset()

        setChartObject(undefined)
        setSelectedChart(null)
    }

    const prevDefaultTitle = usePrevious(form.values.useDefaultTitle)
    const { data } = useContext(LunarContextData) as ILunarState

    //check the open state to check whether or not to reset the state
    useEffect(() => {
        if(active === false)
            reset()
    }, [active])

    //whenever the project data is updated, generate the selectable options
    useEffect(() => {
        async function main() {
            let charts = ExtractChartsWrapper(data)
            let presentationCharts = [] as IPresentationChart[]
            for(let i = 0; i < charts.length; i++) {
                let chart = charts[i]
                let chart_data = chart.data
                if(chart_data === undefined)
                    continue

                let presentationChart = {} as IPresentationChart
                presentationChart.node_id = chart.node_id
                if(
                    chart_data.chartGlobals === undefined || 
                    chart_data.chartSettings === undefined || 
                    chart_data.quantaIndicators === undefined
                )
                    continue
                presentationChart.chartGlobals = chart_data.chartGlobals
                presentationChart.chartSettings = chart_data.chartSettings
                presentationChart.indicators = chart_data.quantaIndicators
                //TODO: we need to add quanta indicators into the presentation chart pipeline
                presentationCharts.push(presentationChart)
            }

            let selectItems = [] as ISelectItem[]
            for(let i = 0; i < presentationCharts.length; i++) {
                let chart = presentationCharts[i]
                let item = {} as ISelectItem

                item.value = chart.node_id
                item.label = chart.chartGlobals.chartTitle
                item.subtext = ""

                let indicators = chart.indicators
                for(let x = 0; x < indicators.length; x++) {
                    let indicator = indicators[x]
                    let indicatorText = await fetchIndicatorText(indicator.datasetId, indicator.indicatorId)
                    if(indicatorText === undefined)
                        continue

                    item.subtext += `${indicatorText.short}`
                    if(x !== indicators.length - 1)
                        item.subtext += ','
                }

                selectItems.push(item)
            }

            setItems([ ...selectItems ])
            setChartObjects([ ...presentationCharts ])
        }

        main()
    }, [data])

    //whenever an id is selected, find the chartobejct and set it
    useEffect(() => {
        let chartObject_ = undefined
        for(let i = 0; i < chartObjects.length; i++) {
            let obj = chartObjects[i]
            if(obj.node_id === selectedChart)
                chartObject_ = obj
        }

        setChartObject(chartObject_)

        //set the new form values
        let useDefaultTitle = form.values.useDefaultTitle
        if(useDefaultTitle === true && chartObject_ !== undefined)
            form.setFieldValue('title', chartObject_!.chartGlobals.chartTitle)
    }, [selectedChart])

    //whenever the values changes, run checks on the title
    useEffect(() => {
        if(chartObject === undefined) {
            if(form.values.title.length > 0)
                form.setFieldValue('title', '')

            return
        }

        if(form.values.useDefaultTitle && prevDefaultTitle === false)
            form.setFieldValue('title', chartObject!.chartGlobals.chartTitle)
    }, [form.values])

    //create the chart
    function createChart() {
        if(!validateForm())
            return
        if(containerRef.current === null)
            return

        let dims = containerRef.current.getBoundingClientRect()
        let width = dims.width
        let height = dims.height

        let chartData = {} as ICreateMediaBlockData
        chartData.width = width
        chartData.height = height
        chartData.chartData = {
            presentationData: chartObject,
            title: form.values.title,
            caption: form.values.caption
        } as IChartBlockData

        createBlock("chart", chartData)
        close()
    }

    return (
        <div className={styles.chartModalWrapper}>
            <Modal
                opened={active}
                onClose={() => { close() }}
                size={"lg"}
                centered
                withCloseButton={false}
                withinPortal={false}
                overlayOpacity={0.2}
                overlayBlur={5}
                exitTransitionDuration={200}
                title={"Select Chart"}
                styles={(theme) => ({
                    modal: { 
                        background: theme.colors.dark[9],
                        border: `1px solid ${theme.colors.dark[4]}` 
                    }
                })}
            >
                <Box mb={"md"} ref={containerRef}>
                    <DocumentChart 
                        data={chartObject}
                        title={form.values.title}
                        caption={form.values.caption}
                        display={true}
                    />
                </Box>

                <Box mt={25}>
                    <Text
                        size={"xs"}
                        transform={"uppercase"}
                        color={"dimmed"}
                    >
                        Config
                    </Text>

                    <Stack 
                        mt={"sm"} 
                        spacing={"xs"}
                    >
                        <Select
                            value={selectedChart}
                            onChange={setSelectedChart}
                            label={"Chart from Project"}
                            placeholder={"Select chart"}
                            itemComponent={SelectItem}
                            data={items}
                            searchable
                            clearable
                            autoFocus={false}
                            nothingFound={"No Charts Found"}
                            filter={(value: string, item: SelectItem) => 
                                item.label!.toLowerCase().includes(value.toLowerCase().trim())
                            }
                        />

                        <Input.Wrapper
                            label={"Chart Title"}
                        >
                            <Input 
                                disabled={form.values.useDefaultTitle}
                                placeholder='Title'
                                {...form.getInputProps('title')}
                            />
                        </Input.Wrapper>
                        <Checkbox 
                            label={"Use default title"}
                            {...form.getInputProps('useDefaultTitle', { type: 'checkbox' })} 
                        />

                        <Input.Wrapper
                            label={"Chart Caption"}
                        >
                            <Input 
                                placeholder='Caption' 
                                {...form.getInputProps('caption')}
                            />
                        </Input.Wrapper>
                    </Stack>
                </Box>

                <Group position='center' pt={20}>
                    <Button
                        size={'md'}
                        radius={'md'}
                        color={'red'}
                        variant={'outline'}
                        onClick={() => { close() }}
                        sx={{ width: 104 }}
                    >
                        Cancel
                    </Button>

                    <Button
                        size={'md'}
                        radius={'md'}
                        color={'indigo'}
                        disabled={!validateForm()}
                        onClick={() => { createChart() }}
                        sx={{ width: 104 }}
                    >
                        Upload
                    </Button>
                </Group>
            </Modal>
        </div>
    )
}

export default CreateChartModal