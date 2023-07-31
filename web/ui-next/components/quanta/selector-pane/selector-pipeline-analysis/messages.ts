import { IPipelineAnalysis } from "../context/types"

interface ILoadPipelineIndicatorsBody {
    organizationId: string,
    quantaId: string
}

interface IAnalyzePipelineFields {
    fieldNames: string[]
}

interface IAnalyzeResponse {
    analysisResults?: IPipelineAnalysis[]
}

export type { ILoadPipelineIndicatorsBody, IAnalyzePipelineFields, IAnalyzeResponse }