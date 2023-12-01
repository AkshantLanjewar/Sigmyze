import { Card, CardSection, Stack, Title, Text, Group, Box, LoadingOverlay } from "@mantine/core"
import React, { useCallback, useContext, useEffect, useState } from "react"
import styles from '../../../../../../pages/datasets/datasets.module.scss'
import { IconAtom2 } from "@tabler/icons"
import { QuantaDatasetManagerData } from "../../../../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../../../../ui/quanta-dataset-manager/types"
import { IDatasetCard } from "../../../../../data/quanta/dataset-api"
import { IRenderedButton } from "../button-renderer"

interface IDatasetCardProps {
    /**
     * This is the index of the rendered dataset
     */
    index: number,

    /**
     * this is the dataset we are trying to render
     */
    dataset: IDatasetCard,

    /**
     * This is the currently selected active dataset
     */
    activeId: string | undefined,

    /**
     * This is the function that sets the active dataset when the card is clicked
     */
    selectDataset: (id: string | undefined) => void
}

const DatasetCard: React.FC<IDatasetCardProps> = ({ 
    index, 
    dataset, 
    activeId,
    selectDataset 
}) => {
    let borderStyle = activeId === dataset.datasetId ? "2px solid #364FC7" : "none"
    return (
        <Card
            radius={"md"}
            className={styles.card}
            style={{ width: 225, border: borderStyle }}
            data-testId={`dataset-${index}`}
            onClick={() => selectDataset(dataset.datasetId)}
        >
            <CardSection className={styles.imageWrapper}>
                <IconAtom2 width={98} height={98} />
            </CardSection>

            <Text mt={"sm"} weight={"bold"}>
                {dataset.datasetName}
            </Text>

            <Text className={styles.description} size={"xs"}>
                {dataset.datasetId?.toUpperCase()}
            </Text>
        </Card>
    )
}

interface ISelectDatasetFragmentProps {
    /**
     * This is the function that sets the form's current rendered buttons
     */
    setFormButtons: (buttons: IRenderedButton[]) => void,

    /**
     * This is the function that resets and cancels the entire flow
     */
    resetFlow: (delay?: boolean) => void,

    /**
     * This is the function that sets the selected dataset in the flow
     */
    setDatasetId: (id: string) => void
}

const SelectDatasetFragment: React.FC<ISelectDatasetFragmentProps> = ({ 
    setFormButtons, 
    resetFlow, 
    setDatasetId 
}) => {
    /**
     * This is a list of collected cards.
     * NOTE: we collect the cards cuz once we add auth those private datasets should be accessible aswell
     */
    const [collectedDatasets, setCollectedDatasets] = useState<IDatasetCard[]>([])

    //whether or not the data fetch is loading
    const [loading, setLoading] = useState<boolean>(false)

    //this is the id of the currently selected dataset id
    const [selected, setSelected] = useState<string | undefined>(undefined)

    const { getPublicDatasetCards } = useContext(QuantaDatasetManagerData) as IDatasetManagerState

    /**
     * effect on mount that is used to fetch the dataset data
     */
    useEffect(() => {
        //outside of the async work, we will be setting the cancel and continue buttons
        const newButtons: IRenderedButton[] = [
            {
                color: "red",
                size: "md",
                radius: "sm",
                disabled: false,
                onClick: (e) => resetFlow(true),
                display: "Cancel",
                testId: "dataset-cancel"
            },
            {
                color: "blue",
                size: "md",
                radius: "sm",
                display: "Continue",
                testId: "dataset-continue",
                disabled: true,
                onClick: (e) => {}
            }
        ]

        setFormButtons([ ...newButtons ])
        async function main() {
            setLoading(true)
            let newCollectedCards: IDatasetCard[] = []
            
            //add all the publicly collected cards
            let publicCards = await getPublicDatasetCards()
            if(publicCards !== undefined)
                newCollectedCards = [ ...newCollectedCards, ...publicCards ]

            setCollectedDatasets([ ...newCollectedCards ])
            setLoading(false)
        }

        main()
    }, [])

    /**
     * This is the function that will handle the selection of a dataset when a card is clicked
     */
    const selectDataset = useCallback((datasetId: string | undefined) => {
        if(datasetId === undefined)
            return

        setSelected(datasetId)
        setDatasetId(datasetId)
    }, [])

    return (
        <Box pos={"relative"}>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                radius={"md"}
                overlayBlur={2}
                loaderProps={{ type: 'bars', color: 'teal' }}
            />

            <Stack spacing={10} mt={"xl"} mb={"sm"}>
                <Title order={2}>Available Datasets</Title>

                <Group
                    spacing={16}
                    mt={"md"}
                    data-testId={"add-i-datasets-wrapper"}
                    data-stage={"dataset"}
                >
                    {collectedDatasets.map((step, index) => (
                        <DatasetCard 
                            index={index} 
                            dataset={step}
                            activeId={selected}
                            selectDataset={selectDataset}
                        />
                    ))}
                </Group>
            </Stack>
        </Box>
    )
}

export { SelectDatasetFragment }