import { IQuantaIndicator } from './indicator'

interface IQuantaIndicatorManager {
    indicators: IQuantaIndicator[]
}

export type { IQuantaIndicatorManager }
export * from './indicator'