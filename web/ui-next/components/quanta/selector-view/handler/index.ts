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
    setSelectedIndicator: Dispatch<SetStateAction<string | undefined>>,
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
                postMessage
            )

            break
        case "indicators_length":
            await indicatorsLengthPublic(
                data,
                publicToken,
                postMessage
            )
                
            break
        case "query_indicator":
            await queryIndicatorPublicHandler(
                data,
                publicToken,
                postMessage,
                categorization,
                pipelineLinks,
                getSchema
            )
            
            break
        case "query_indicator_page":
            await queryIndicatorsPagePublicHandler(
                data,
                publicToken,
                postMessage
            )

            break
        case "query_paged_indicators":
            await querySelectedIndicatorsPagePublicHandler(
                data,
                publicToken,
                categorization,
                pipelineLinks,
                getSchema,
                postMessage
            )
                
            break
        case "query_indicator_by_id":
            await queryIndicatorIdPublicHandler(
                data,
                publicToken,
                postMessage
            )
            
            break
        default:
            break
    }
}

export default productionMessageHandler