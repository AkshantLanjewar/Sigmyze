import React from "react"
import { IQuantaCategorization, IQuantaSelector } from "../../data/quanta/types/project"
import { Stack } from "@mantine/core"
import ProductionSelectorFrame from "./production-frame"
import { IQuantaSchema } from "../schema-editor/types"

interface IViewProps {
    selectors: IQuantaSelector[],
    quantaId: string | null,
    publicToken: string | undefined,
    categorization: IQuantaCategorization | undefined,
    schemas: IQuantaSchema[]
}

const View: React.FC<IViewProps> = React.memo(({ selectors, quantaId, publicToken, categorization, schemas }) => {
    return (
        <>
            <Stack spacing={"md"}>
                {selectors.map((step) => (
                    <div>
                        <ProductionSelectorFrame 
                            selector={step}
                            publicToken={publicToken}
                            quantaId={quantaId}
                            categorization={categorization}
                            schemas={schemas}
                        />
                    </div>
                ))}
            </Stack>
        </>
    )
})

export default View