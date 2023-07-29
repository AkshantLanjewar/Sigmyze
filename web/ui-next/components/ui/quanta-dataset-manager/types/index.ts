import { IDatasetCard } from '../../../data/quanta/dataset-api'
import { IQuantaCategorization, IQuantaSelector } from '../../../data/quanta/types/project'
import { IQuantaIndicator } from '../../../quanta/quanta-indicator-manager/types'
import { IDatasetCacheObject, IDatasetProjects, IQuantaIndicatorText } from './dataset'

interface IQuantaIndicatorShell {
    datasetId: string,
    indicatorId: string
}

interface IDatasetManagerState {
    primeDataset: (datasetId: string) => Promise<IDatasetCacheObject | undefined>,
    getPublicDatasetCards: () => Promise<IDatasetCard[] | undefined>,
    fetchIndicator: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicator | undefined>,
    fetchDatasetEditor: (datasetId: string) => Promise<IDatasetProjects | undefined>

    getDatasetSelectors: (datasetId: string) => IQuantaSelector[] | undefined,
    getDatasetCategorization: (datasetId: string) => IQuantaCategorization | undefined,
    getDatasetText: (datasetId: string, type: string) => string | undefined,

    formatIndicatorText: (datasetId: string, indicatorId: string, text: string) => Promise<string | undefined>,
    fetchIndicatorText: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicatorText | undefined>
}

export * from './dataset'

export type { 
    IQuantaIndicatorShell,
    IDatasetManagerState 
}