import { Button, Group, Modal } from '@mantine/core'
import ObjectSearch, { SelectedState } from '../../object-search/object-search'

import { DatasetsTable } from '../../data/datasets/DatasetsAPI'
import { IDataset, IDatasetObject, IIndicator, IDatasetObjects, IObjectIndicator } from '../../data/datasets/DatasetsTypes'
import { useEffect, useState } from 'react'

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
    data: IAddIndicatorData
}

const AddIndicatorModal: React.FC<IAddIndicatorProps> = ({ modalState, close, data }) => {
    const [objects, setObjects] = useState([[]] as Array<IDatasetObject[]>)
    const [page, setPage]       = useState(0)

    const [selectedD, setSelectedD] = useState<SelectedState | null>(null)
    const [selectedO, setSelectedO] = useState<SelectedState | null>(null)

    const [dataPacket, setData] = useState<IIndicator>({} as IIndicator)

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
    }, [dataPacket])

    let selectFunc = setSelectedD
    if(page === 1)
        selectFunc = setSelectedO

    return (
        <Modal
            opened={modalState === "add_indicator"}
            centered
            onClose={() => { close() }}
            overlayOpacity={0.55}
            overlayBlur={3}
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
            />

            {page === 0 && (
                <Group 
                    position={'center'}
                    mb={'md'}
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
                >
                    <Button
                        color={"indigo"}
                        onClick={() => { setPage(1) }}
                    >
                        Previous
                    </Button>
                </Group>
            )}
        </Modal>
    )
}

export type { IAddIndicatorData, RawIndicator }
export default AddIndicatorModal