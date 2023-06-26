import { MutableRefObject } from "react"
import { IQuantaCategorization } from "../../../data/quanta/types/project"
import { IQuantaSchema } from "../../schema-editor/types"
import { indicatorsLengthPublic, queryIndicatorsLengthPublic } from "./length"
import { queryIndicatorPublicHandler } from "./data"

const productionMessageHandler = async (
    messageFunction: string,
    data: string,
    publicToken: string | undefined,
    quantaId: string | null,
    categorization: IQuantaCategorization | undefined,
    pipelineLinks: {[key: string]: string} | undefined,
    pingReceived: MutableRefObject<boolean>,
    getSchema: (id: string) => IQuantaSchema | undefined,
    postMessage: (msg: string) => void,
) => { 
    switch(messageFunction) {
        case "ping":
            pingReceived.current = true
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
        default:
            break
    }
}

export default productionMessageHandler