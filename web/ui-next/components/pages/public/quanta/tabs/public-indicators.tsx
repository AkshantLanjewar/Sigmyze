import { useContext, useEffect, useState } from "react"
import { QuantaDatasetManagerData } from "../../../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../../../ui/quanta-dataset-manager/types"
import { IQuantaCategorization, IQuantaSelector, IQuantaTextStore, ProjectSchemas } from "../../../../data/quanta/types/project"
import DatasetSelectionView from "../../../../quanta/selector-view"

interface IPublicIndicatorsProps {
    datasetId: string
}

const PublicIndicatorsPanel: React.FC<IPublicIndicatorsProps> = ({ datasetId }) => {
    //all the state we need in order to display the dataset selector panel
    const [categorization, setCategorization] = useState<IQuantaCategorization | undefined>(undefined)
    const [schemas, setSchemas] = useState<ProjectSchemas[]>([])
    const [textStore, setTextStore] = useState<IQuantaTextStore>({})
    const [selectors, setSelectors] = useState<IQuantaSelector[]>([])
    const [_selectedIndicator, setSelectedIndicator] = useState<string>("")

    const { primeDataset } = useContext(QuantaDatasetManagerData) as IDatasetManagerState

    useEffect(() => {
        async function main() {
            let dataset = await primeDataset(datasetId)
            if(dataset === undefined)
                return

            setCategorization({ ...dataset.categorization })
            setSchemas([ ...dataset.schemas ])
            setTextStore({ ...dataset.textStore })
            setSelectors([ ...dataset.selectors ])
        }

        main()
    }, [datasetId])

    return categorization
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

export default PublicIndicatorsPanel