import { IDatasetCard } from '../../../data/quanta/dataset-api'
import { IQuantaCategorization, IQuantaSelector } from '../../../data/quanta/types/project'
import { IQuantaIndicator } from '../../../quanta/quanta-indicator-manager/types'
import { IQuantaQuery } from '../../../quanta/selector-frame/types'
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

    getDatasetSelectors: (datasetId: string) => Promise<IQuantaSelector[] | undefined>,
    getDatasetCategorization: (datasetId: string) => Promise<IQuantaCategorization | undefined>,
    getDatasetText: (datasetId: string, type: string) => Promise<string | undefined>,

    formatIndicatorText: (datasetId: string, indicatorId: string, text: string) => Promise<string | undefined>,
    fetchIndicatorText: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicatorText | undefined>,
    selectIndicators: (datasetId: string, query: IQuantaQuery[]) => Promise<IQuantaIndicator[] | undefined>,
    selectIndicatorsPaged: (datasetId: string, query: IQuantaQuery[], pageLength: number, page: number) => Promise<IQuantaIndicator[] | undefined>,
    queryIndicatorsPaged: (datasetId: string, pageLength: number, page: number) => Promise<IQuantaIndicator[] | undefined>,
    queryIndicatorsLength: (datasetId: string, query: IQuantaQuery[]) => Promise<number | undefined>,
    indicatorsLength: (datasetId: string) => Promise<number | undefined>

}

export * from './dataset'

export type { 
    IQuantaIndicatorShell,
    IDatasetManagerState 
}