import { Button, Group, Modal } from '@mantine/core'
import ObjectSearch, { SelectedState } from '../../ui/object-search/object-search'

import { ILunarState, ILunarUIData } from "../../data/lunar/types/types"
import { DatasetsTable } from '../../data/datasets/DatasetsAPI'
import { IDataset, IDatasetObject, IIndicator, IDatasetObjects, IObjectIndicator } from '../../data/datasets/DatasetsTypes'
import { useContext, useEffect, useState } from 'react'
import ModalChips from './modal-chips'
import { LunarContextData } from '../../data/lunar/context'

interface RawIndicator {
    dataset: string,
    indicators: Array<IObjectIndicator>
}

interface IAddIndicatorData {
    datasets: Array<IDataset>,
    datasetsObject: Array<IDatasetObjects>,
    indicators: Array<RawIndicator>
}

interface IAddIndicatorProps {
    modalState: string | undefined | null,
    close: () => void,
    data: IAddIndicatorData,
}

const AddIndicatorModal: React.FC<IAddIndicatorProps> = ({ modalState, close, data }) => {
    const [objects, setObjects] = useState([[]] as Array<IDatasetObject[]>)
    const [page, setPage]       = useState(0)

    const [selectedD, setSelectedD] = useState<SelectedState | null>(null)
    const [selectedO, setSelectedO] = useState<SelectedState | null>(null)
    const [selectedI, setSelectedI] = useState<SelectedState | null>(null)

    const [dataPacket, setData] = useState<IIndicator>({} as IIndicator)

    const lunarContext = useContext(LunarContextData) as ILunarState
    const { ui } = lunarContext

    useEffect(() => {
        let datasetObjects = [] as IDatasetObject[]
        for(let i = 0; i < data.datasets.length; i++) {
            let dataset = data.datasets[i]
            let object  = {
                object_fullname: DatasetsTable[dataset.name as keyof typeof DatasetsTable],
                object_id: dataset.name,
                object_logo: dataset.logo,

                image_size_x: 48,
                image_size_y: 48,
                text_size: "xl"
            } as IDatasetObject

            datasetObjects.push(object)
        }

        setObjects([ [...datasetObjects], [], [] ])
    }, [])

    useEffect(() => {
        setPage(0)
        setSelectedD(null)
        setSelectedO(null)
        setSelectedI(null)
        setData({} as IIndicator)
    }, [modalState])

    useEffect(() => {
        let dataset = dataPacket.dataset
        if(dataset !== undefined) {
            let selected_objects = [] as IDatasetObject[]
            for(let i = 0; i < data.datasetsObject.length; i++) {
                let dataset = data.datasetsObject[i]
                let objects = dataset.objects
                if(dataset.dataset === dataPacket.dataset)
                    selected_objects = objects
            }

            let nObjects = objects
            objects[1] = selected_objects
            setObjects([ ...nObjects ])
        }

        if(dataset !== undefined && dataPacket.object !== undefined) {
            let object = dataPacket.object
            let selected_objects = [] as IDatasetObject[]
            let completed = [] as string[]

            for(let i = 0; i < data.indicators.length; i++) {
                let dataset_ = data.indicators[i]
                if(dataset_.dataset !== dataset || dataset_.dataset in completed)
                    continue
                
                
                for(let x = 0; x < dataset_.indicators.length; x++) {
                    let indicator = dataset_.indicators[x]
                    
                    let indicator_ = { } as IIndicator
                    indicator_.dataset = dataset
                    indicator_.indicator = indicator
                    indicator_.object = object

                    let selected_object = {} as IDatasetObject
                    selected_object.object_id = indicator.indicator_id
                    selected_object.object_fullname = `${indicator.indicator_fullname} [${indicator.indicator_id}]`
                    selected_object.object_logo = ""
                    selected_object.text_size = "sm"
                    selected_object.text_weight = "bold"
                    selected_object.text_position = "apart"
                    selected_object.indicator = indicator_
                    selected_object.hideLogo = true
                    selected_object.sparkline = true

                    completed.push(dataset_.dataset)
                    selected_objects.push(selected_object)
                }
            }
            let oObjects = objects
            oObjects[2] = []
            setObjects([ ...oObjects ])

            let nObjects = objects
            objects[2] = selected_objects.filter((v, i, a) => a.indexOf(v) === i)
            setObjects([ ...nObjects ])
        }
    }, [dataPacket])

    let selectFunc = setSelectedD
    if(page === 1)
        selectFunc = setSelectedO
    if(page === 2)
        selectFunc = setSelectedI

    return (
        <Modal
            opened={modalState === "add_indicator"}
            centered
            onClose={() => { close() }}
            overlayOpacity={0.55}
            overlayBlur={3}
            exitTransitionDuration={200}
            size={"lg"}
            withCloseButton={false}
            sx={(theme) => ({
                '.mantine-Paper-root': {
                    padding: 0,
                    backgroundColor: theme.colors.dark[8]
                }
            })}
        >
            <ObjectSearch
                objects={objects[page]}
                submitFunc={() => { }}
                useModal={false}
                submitButton={false}
                setSelected={selectFunc}
                chips={<ModalChips indicator={dataPacket} />}
            />

            {page === 0 && (
                <Group 
                    position={'center'}
                    mb={'md'}
                    mt={'md'}
                >
                    <Button
                        disabled={selectedD === null}
                        color={"indigo"}
                        onClick={() => { 
                            setPage(1) 
                            
                            let oData     = dataPacket
                            oData.dataset = selectedD?.object.object_id!
                            setData({ ...oData })
                        }}
                    >
                        Next
                    </Button>
                </Group>
            )}

            {page === 1 && (
                <Group 
                    position={'center'}
                    mb={'md'}
                    mt={'md'}
                >
                    <Button
                        color={"indigo"}
                        onClick={() => { setPage(0) }}
                    >
                        Previous
                    </Button>

                    <Button 
                        disabled={selectedO === null}
                        color={"indigo"}
                        onClick={() => {
                            setPage(2)

                            let oData = dataPacket
                            oData.object = selectedO?.object!
                            setData({ ...oData })
                        }}
                    >
                        Next
                    </Button>
                </Group>
            )}

            {page === 2 && (
                <Group 
                    position={'center'}
                    mb={'md'}
                    mt={'md'}
                >
                    <Button
                        color={"indigo"}
                        onClick={() => { 
                            setPage(1) 
                            setSelectedI(null)
                        }}
                    >
                        Previous
                    </Button>

                    <Button
                        disabled={selectedI === null}
                        color={"indigo"}
                        onClick={() => {
                            let indicator = selectedI?.object.indicator
                            if(indicator === undefined)
                                return
                            if(ui === null || ui === undefined)
                                return

                            lunarContext.addIndicator(ui.visual_id, indicator)
                            close()
                        }}
                    >
                        Add Indicator
                    </Button>
                </Group>
            )}
        </Modal>
    )
}

export type { IAddIndicatorData, RawIndicator }
export default AddIndicatorModal