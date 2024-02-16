import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { IDatasetCache, IDatasetManagerState, IDatasetProjects, IQuantaIndicatorCache, IQuantaIndicatorShell } from "./types"
import { useQuantaDatasetCache } from "./hooks"

interface IQuantaDatasetManagerProps {
    children?: JSX.Element | never[]
}

const QuantaDatasetManagerData = createContext<IDatasetManagerState | null>(null)

const QuantaDatasetManager: React.FC<IQuantaDatasetManagerProps> = ({ children }) => {
    const {
        primeDataset,
        formatIndicatorText,
        fetchIndicatorText,
        selectIndicators,
        selectIndicatorsPaged,
        queryIndicatorsPaged,
        queryIndicatorsLength,
        indicatorsLength,
        fetchDatasetEditor,
        getDatasetSelectors,
        fetchIndicator,
        getPublicDatasetCards,
        getDatasetCategorization,
        getDatasetText
    } = useQuantaDatasetCache()
    
    
    const memoValue: IDatasetManagerState = useMemo(() => ({
        primeDataset,
        getPublicDatasetCards,
        fetchIndicator,
        fetchDatasetEditor,
        getDatasetSelectors,
        getDatasetCategorization,
        getDatasetText,
        formatIndicatorText,
        fetchIndicatorText,
        selectIndicators,
        selectIndicatorsPaged,
        queryIndicatorsPaged,
        queryIndicatorsLength,
        indicatorsLength
    }), [])
    
    return (
        <>
            <QuantaDatasetManagerData.Provider value={memoValue}>
                <div style={{ width: "100%", height: "100%" }}>
                    {children}
                </div>
            </QuantaDatasetManagerData.Provider>
        </>
    )
}

export { QuantaDatasetManagerData }
export default QuantaDatasetManager