import { Box, LoadingOverlay } from "@mantine/core"
import { useContext, useEffect, useState } from "react"
import { IQuantaCategorization, IQuantaSelector, IQuantaTextStore, ProjectSchemas } from "../../../../../data/quanta/types/project"
import { QuantaDatasetManagerData } from "../../../../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../../../../ui/quanta-dataset-manager/types"
import DatasetSelectionView from "../../../../../quanta/selector-view"
import { IRenderedButton } from "../button-renderer"
import { IQuantaIndicatorLoc } from "../../../../data-manager/state"

interface ISelectIndicatorFragmentProps {
    /**
     * this is the id of the dataset that was selected
     */
    datasetId: string,

    /**
     * This is the function that sets the form's current rendered buttons
     */
    setFormButtons: (buttons: IRenderedButton[]) => void,

    /**
     * This is the function that moves the flow back one step
     */
    datasetPrevious: () => void,

    /**
     * This is the function that sets the collected indicator id
     */
    setIndicatorId: (id: string) => void,

    /**
     * This is the function that adds an indicator to the queue
     */
    addIndicator: (indicator: IQuantaIndicatorLoc) => void

    /**
     * This is the function that resets the entire flow
     */
    resetFlow: () => void
}

const SelectIndicatorFragment: React.FC<ISelectIndicatorFragmentProps> = ({ 
    datasetId,
    setFormButtons,
    datasetPrevious ,
    setIndicatorId,
    addIndicator,
    resetFlow
}) => {
    //whether or not the component is loading
    const [loading, setLoading] = useState<boolean>(false)

    //this is the categorization, needed for the indicator selector renderer
    const [categorization, setCategorization] = useState<IQuantaCategorization | undefined>(undefined)
    //these are the schemas for the dataset, needed for the indicator selector renderer
    const [schemas, setSchemas] = useState<ProjectSchemas[]>([])
    //this is the textStore for the dataset, needed for the indicator selector renderer
    const [textStore, setTextStore] = useState<IQuantaTextStore>({})
    //these are the selectors for the dataset, needed for the selector renderer
    const [selectors, setSelectors] = useState<IQuantaSelector[]>([])
    //this is the selected indicator within the dataset
    const [selectedIndicator, setSelectedIndicator] = useState<string>("")
    //toggle to initiate the add indicator sequence
    const [addToggle, setAddToggle] = useState<boolean>(false)

    const { primeDataset } = useContext(QuantaDatasetManagerData) as IDatasetManagerState
    
    useEffect(() => {
        //outside of the async work we will be setting the buttons
        const newButtons: IRenderedButton[] = [
            {
                color: "red",
                size: "md",
                radius: "sm",
                display: "Previous",
                testId: "indicator-previous",
                disabled: false,
                onClick: () => datasetPrevious()
            },
            {
                color: "indigo",
                size: "md",
                radius: "sm",
                display: "Add Indicator",
                testId: "add-indicator",
                disabled: true,
                onClick: () => setAddToggle(true)
            }
        ]

        setFormButtons([ ...newButtons ])
        async function main() {
            setLoading(true)
            let dataset = await primeDataset(datasetId)
            setLoading(false)

            if(dataset === undefined)
                return
            if(dataset.schemas === undefined || dataset.selectors === undefined)
                return

            setCategorization({ ...dataset.categorization })
            setSchemas([ ...dataset.schemas ])
            setTextStore({ ...dataset.textStore })
            setSelectors([ ...dataset.selectors ])
        }

        main()
    }, [datasetId])

    useEffect(() => {
        if(selectedIndicator.length < 6)
            return

        setIndicatorId(selectedIndicator)
    }, [selectedIndicator])

    /**
     * This is the effect that runs when the add toggle runs
     */
    useEffect(() => {
        if(addToggle === false || selectedIndicator.length === 0)
            return

        const addPackage: IQuantaIndicatorLoc = {
            datasetId: datasetId,
            indicatorId: selectedIndicator
        }

        addIndicator(addPackage)
        setAddToggle(false)
        resetFlow()
    }, [addToggle, datasetId, selectedIndicator])

    return (
        <Box pos={"relative"}>
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                radius={"md"}
                overlayBlur={2}
                loaderProps={{ type: 'bars', color: 'teal' }}
            />

            <Box mb={"xl"}>
                {categorization
                    ? (
                        <DatasetSelectionView
                            categorization={categorization}
                            schemas={schemas}
                            textStore={textStore}
                            selectors={selectors}
                            publicToken={datasetId}
                            setSelectedIndicator={setSelectedIndicator}
                        />
                    )
                    : null
                }
            </Box>
        </Box>
    )
}

export { SelectIndicatorFragment }