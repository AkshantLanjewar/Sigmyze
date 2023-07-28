import React, { Dispatch, SetStateAction } from "react"
import { IQuantaCategorization, IQuantaSelector, IQuantaTextStore, ProjectSchemas } from "../../data/quanta/types/project"
import { Stack } from "@mantine/core"
import ProductionSelectorFrame from "./production-frame"

interface IViewProps {
    selectors: IQuantaSelector[],
    publicToken: string | undefined,
    categorization: IQuantaCategorization | undefined,
    schemas: ProjectSchemas[],
    textStore: IQuantaTextStore,
    selectionIndex: number | undefined,
    setSelectorValue: (selectorId: string, value: string) => void,
    setSelectedIndicator: (indicatorId: string) => void,
    selectedValues: {
        [key: string]: string | undefined;
    }    
}

const View: React.FC<IViewProps> = React.memo(({ 
    selectors, 
    publicToken, 
    categorization, 
    schemas, 
    textStore,
    selectionIndex,
    selectedValues,
    setSelectedIndicator,
    setSelectorValue
}) => {
    return (
        <>
            <Stack spacing={"md"}>
                {selectors.map((step) => (
                    <div>
                        <ProductionSelectorFrame 
                            selector={step}
                            publicToken={publicToken}
                            categorization={categorization}
                            schemas={schemas}
                            textStore={textStore}
                            selectionIndex={selectionIndex}
                            selectedValues={selectedValues}
                            setSelectorValue={setSelectorValue}
                            setSelectedIndicator={setSelectedIndicator}
                        />
                    </div>
                ))}
            </Stack>
        </>
    )
})

export default View