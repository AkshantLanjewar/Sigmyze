import { IQuantaCategorization, IQuantaSelector, IQuantaTextStore, ProjectSchemas } from "../../data/quanta/types/project"
import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import View from "./view"

interface IDatasetSelectionViewProps {
    categorization: IQuantaCategorization | undefined,
    schemas: ProjectSchemas[],
    textStore: IQuantaTextStore,
    selectors: IQuantaSelector[],
    publicToken: string | undefined,
    setSelectedIndicator: Dispatch<SetStateAction<string | undefined>>
}

const DatasetSelectionView: React.FC<IDatasetSelectionViewProps> = ({ 
    categorization, 
    schemas, 
    textStore, 
    selectors,
    publicToken,
    setSelectedIndicator 
}) => {
    const [selectedValues, setSelectedValues] = useState<{[key: string]: string | undefined}>({})
    //display selectors, since we hide selectors that have an index greater than the selected index
    const [displaySelectors, setDisplaySelectors] = useState<IQuantaSelector[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined)

    //function that sets a selection value in the selected values
    const setSelectorValue = useCallback((selectorId: string, value: string) => { 
        let nSelectedValues = selectedValues
        if(Object.keys(nSelectedValues).includes(selectorId) === false)
            return

        nSelectedValues[selectorId] = value
        setSelectedValues({ ...nSelectedValues })
    }, [selectedValues])

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

        setSelectedIndex(selectionIndex)
        setDisplaySelectors([ ...nDisplaySelectors ])
    }, [selectedValues])

    return (
        <View 
            selectors={displaySelectors} 
            publicToken={publicToken}
            categorization={categorization}
            schemas={schemas}
            textStore={textStore}
            selectionIndex={selectedIndex}
            selectedValues={selectedValues}
            setSelectedIndicator={setSelectedIndicator}
            setSelectorValue={setSelectorValue}
        />
    )
}

export default DatasetSelectionView