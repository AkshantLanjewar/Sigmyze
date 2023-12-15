import { Dispatch, MutableRefObject, SetStateAction } from "react"
import { IQuantaCategorization, ISelectorLinks } from "../../../data/quanta/types/project"
import { IQuantaSchema } from "../../schema-editor/types"
import { indicatorsLengthPublic, queryIndicatorsLengthPublic } from "./length"
import { selectedPublicHandler } from "./select"
import { 
    queryIndicatorIdPublicHandler, 
    queryIndicatorPublicHandler, 
    queryIndicatorsPagePublicHandler, 
    querySelectedIndicatorsPagePublicHandler 
} from "./data"
import { IQuantaQuery } from "../../selector-frame/types"
import { IQuantaIndicator } from "../../quanta-indicator-manager/types"

const productionMessageHandler = async (
    selectorId: string,
    messageFunction: string,
    data: string,
    publicToken: string | undefined,
    categorization: IQuantaCategorization | undefined,
    pipelineLinks: {[key: string]: string} | undefined,
    pingReceived: MutableRefObject<boolean>,
    getSchema: (id: string) => IQuantaSchema | undefined,
    postMessage: (msg: string) => void,
    setFlushCache: Dispatch<SetStateAction<boolean>>,
    intialSelection: MutableRefObject<boolean>,
    selectorLinks: ISelectorLinks,
    setSelectorValue: (selectorId: string, value: string) => void,
    setSelectedIndicator: (indicatorId: string) => void,
    queryIndicatorsLength: (datasetId: string, query: IQuantaQuery[]) => Promise<number | undefined>,
    indicatorsLength: (datasetId: string) => Promise<number | undefined>,
    selectIndicators: (datasetId: string, query: IQuantaQuery[]) => Promise<IQuantaIndicator[] | undefined>,
    queryIndicatorsPaged: (datasetId: string, pageLength: number, page: number) => Promise<IQuantaIndicator[] | undefined>,
    selectIndicatorsPaged: (datasetId: string, query: IQuantaQuery[], pageLength: number, page: number) => Promise<IQuantaIndicator[] | undefined>,
    fetchIndicator: (datasetId: string, indicatorId: string) => Promise<IQuantaIndicator | undefined>,
) => { 
    switch(messageFunction) {
        case "ping":
            pingReceived.current = true
            setFlushCache(true)

            break
        case "selected":
            await selectedPublicHandler(
                data,
                selectorId,
                selectorLinks,
                intialSelection,
                getSchema,
                setSelectorValue,
                setSelectedIndicator
            )

            break
        case "query_indicator_length":
            await queryIndicatorsLengthPublic(
                data,
                publicToken,
                categorization,
                pipelineLinks,
                getSchema,
                postMessage,
                queryIndicatorsLength
            )

            break
        case "indicators_length":
            await indicatorsLengthPublic(
                data,
                publicToken,
                postMessage,
                indicatorsLength
            )
                
            break
        case "query_indicator":
            await queryIndicatorPublicHandler(
                data,
                publicToken,
                postMessage,
                categorization,
                pipelineLinks,
                getSchema,
                selectIndicators
            )
            
            break
        case "query_indicator_page":
            await queryIndicatorsPagePublicHandler(
                data,
                publicToken,
                postMessage,
                queryIndicatorsPaged
            )

            break
        case "query_paged_indicators":
            await querySelectedIndicatorsPagePublicHandler(
                data,
                publicToken,
                categorization,
                pipelineLinks,
                getSchema,
                postMessage,
                selectIndicatorsPaged
            )
                
            break
        case "query_indicator_by_id":
            await queryIndicatorIdPublicHandler(
                data,
                publicToken,
                postMessage,
                fetchIndicator
            )
            
            break
        default:
            break
    }
}

export default productionMessageHandler