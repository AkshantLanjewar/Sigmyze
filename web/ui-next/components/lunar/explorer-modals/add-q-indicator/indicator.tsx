import React, { memo, useCallback, useContext, useEffect, useState } from "react";
import { IRawFragmentTemplateProps } from "../../../ui/multi-form/types";
import { IDatasetOutput } from "./dataset";
import { QuantaDatasetManagerData } from "../../../ui/quanta-dataset-manager";
import { IDatasetManagerState } from "../../../ui/quanta-dataset-manager/types";
import { IQuantaCategorization, IQuantaSelector, IQuantaTextStore, ProjectSchemas } from "../../../data/quanta/types/project";
import DatasetSelectionView from "../../../quanta/selector-view";

interface IIndicatorOutput {
    indicatorId: string
}

interface IViewProps {
    categorization: IQuantaCategorization | undefined,
    schemas: ProjectSchemas[],
    textStore: IQuantaTextStore,
    selectors: IQuantaSelector[],
    publicToken: string | undefined,
    setSelectedIndicator: (indicatorId: string) => void
}

const View: React.FC<IViewProps> = memo(({
    categorization,
    schemas,
    textStore,
    selectors,
    publicToken,
    setSelectedIndicator
}) => (
    <DatasetSelectionView
        categorization={categorization}
        schemas={schemas}
        textStore={textStore}
        selectors={selectors}
        publicToken={publicToken}
        setSelectedIndicator={setSelectedIndicator}
    />
))

const IndicatorFormStep: React.FC<IRawFragmentTemplateProps> = ({ collectedBefore, setSelected }) => {
    const [datasetId, setDatasetId] = useState<string | undefined>(undefined)
    //this is all the state needed in order to display the selector sequence
    const [categorization, setCategorization] = useState<IQuantaCategorization | undefined>(undefined)
    const [schemas, setSchemas] = useState<ProjectSchemas[]>([])
    const [textStore, setTextStore] = useState<IQuantaTextStore | undefined>(undefined)
    const [selectors, setSelectors] = useState<IQuantaSelector[]>([])

    const { primeDataset } = useContext(QuantaDatasetManagerData) as IDatasetManagerState

    //TODO: collect the datasetId from the previously collected values
    useEffect(() => {
        if(collectedBefore === undefined)
            return

        let collectedKeys = Object.keys(collectedBefore)
        if(collectedKeys.includes("dataset") === false)
            return

        let collectedDataset = collectedBefore["dataset"]
        if(collectedDataset === undefined)
            return

        let datasetOutputParsed: IDatasetOutput = JSON.parse(collectedDataset)
        let newDatasetId: string | undefined = datasetOutputParsed['datasetId']
        if(newDatasetId === undefined)
            return

        setDatasetId(newDatasetId)
    }, [collectedBefore])

    //fetch the datasetId's selector sequence
    useEffect(() => {
        async function main() {
            if(datasetId === undefined)
                return

            let primedDataset = await primeDataset(datasetId)
            if(primedDataset === undefined)
                return

            //we need to collect the following in order to display the selector sequence
            // the categorization for the dataset
            // the schemas for the dataset (we need to add this)
            // the text store for the dataset
            // the selectors for the dataset
            setCategorization({ ...primedDataset.categorization })
            setSchemas([ ...primedDataset.schemas ])
            setTextStore({ ...primedDataset.textStore })
            setSelectors([ ...primedDataset.selectors ])
        }

        main()
    }, [datasetId])

    //function that handles when an indicatorId is selected
    const handleIndicatorId = useCallback((indicatorId: string) => {
        let output: IIndicatorOutput = { indicatorId }
        let outputString = JSON.stringify(output)

        setSelected(outputString)
    }, [setSelected])
    
    return textStore
        ? (
            <View
                categorization={categorization}
                schemas={schemas}
                textStore={textStore}
                selectors={selectors}
                publicToken={datasetId}
                setSelectedIndicator={handleIndicatorId}
            />
        )
        : null
}

export type { IIndicatorOutput }
export default IndicatorFormStep