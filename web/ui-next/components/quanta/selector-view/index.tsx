import { IQuantaCategorization, IQuantaSelector, IQuantaTextStore } from "../../data/quanta/types/project"
import { IQuantaSchema } from "../schema-editor/types"
import { useContext, useEffect, useState } from "react"
import View from "./view"

interface IDatasetSelectionViewProps {
    quantaId: string | null,
    categorization: IQuantaCategorization | undefined,
    schemas: IQuantaSchema[],
    textStore: IQuantaTextStore,
    selectors: IQuantaSelector[]
}

const DatasetSelectionView: React.FC<IDatasetSelectionViewProps> = ({ 
    quantaId, 
    categorization, 
    schemas, 
    textStore, 
    selectors 
}) => {
    const [selectedValues, setSelectedValues] = useState<{[key: string]: string | undefined}>({})
    //display selectors, since we hide selectors that have an index greater than the selected index
    const [displaySelectors, setDisplaySelectors] = useState<IQuantaSelector[]>([])
    const [publicToken, setPublicToken] = useState<string | undefined>(undefined)

    //this effect is done to setup the intial values for the selected values object
    useEffect(() => {
        let nSelectedValues = {} as {[key: string]: string | undefined}
        for(let i = 0; i < selectors.length; i++) {
            let selector = selectors[i]
            if(selector.selectorId === undefined)
                continue

            nSelectedValues[selector.selectorId] = undefined
        }

        setSelectedValues({ ...nSelectedValues })
    }, [])

    //whenever the selected values is changed, updates the display index
    useEffect(() => {
        let selectionIndex = 0
        for(let i = 0; i < selectors.length; i++) {
            let selector = selectors[i]
            if(selector.selectorId === undefined)
                continue

            let selectedValue = selectedValues[selector.selectorId]
            if(selectedValue === undefined) {
                selectionIndex = i
                break
            }
        }

        //Update the internal view of selectors to reflect the display index
        let nDisplaySelectors = [] as IQuantaSelector[]
        for(let i = 0; i < selectors.length; i++) {
            let selector = selectors[i]
            if(selector.selectorId === undefined || i > selectionIndex)
                continue

            nDisplaySelectors.push(selector)
        }

        setDisplaySelectors([ ...nDisplaySelectors ])
    }, [selectedValues])

    return (
        <View 
            selectors={displaySelectors} 
            quantaId={quantaId}
            publicToken={publicToken}
            categorization={categorization}
            schemas={schemas}
        />
    )
}

export default DatasetSelectionView