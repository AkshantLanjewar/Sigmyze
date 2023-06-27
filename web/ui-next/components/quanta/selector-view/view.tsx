import React from "react"
import { IQuantaCategorization, IQuantaSelector, IQuantaTextStore, ProjectSchemas } from "../../data/quanta/types/project"
import { Stack } from "@mantine/core"
import ProductionSelectorFrame from "./production-frame"

interface IViewProps {
    selectors: IQuantaSelector[],
    publicToken: string | undefined,
    categorization: IQuantaCategorization | undefined,
    schemas: ProjectSchemas[],
    textStore: IQuantaTextStore,
    setSelectorValue: (selectorId: string, value: string) => void
}

const View: React.FC<IViewProps> = React.memo(({ 
    selectors, 
    publicToken, 
    categorization, 
    schemas, 
    textStore,
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
                            setSelectorValue={setSelectorValue}
                        />
                    </div>
                ))}
            </Stack>
        </>
    )
})

export default View