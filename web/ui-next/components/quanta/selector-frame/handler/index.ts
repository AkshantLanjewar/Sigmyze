import { showNotification } from "@mantine/notifications"
import { queryIndicatorHandler, queryIndicatorId, queryIndicatorsPage, querySelectedIndicatorsPage } from "./indicator-data"
import { IAuthenticationData } from "../../../data/user/types"
import { indicatorsLength, queryIndicatorLength } from "./indicator-length"
import { Dispatch, MutableRefObject, SetStateAction } from "react"
import { IQuantaCategorization } from "../../../data/quanta/types/project"
import { IQuantaSchema } from "../../schema-editor/types"

const messageHandler = async (
    func: string, 
    data: string,
    authData: IAuthenticationData | null | undefined,
    quantaId: string | null,
    postMessage: (msg: string) => void,
    setPingReceived: Dispatch<SetStateAction<boolean>>,
    categorization: IQuantaCategorization | undefined,
    pipelineLinks: {[key: string]: string} | undefined,
    getSchema: (parentId: string) => IQuantaSchema | undefined,
    pingRef: MutableRefObject<boolean>
) => {
    try {
        //rebuild a switch to make it useful
        switch(func) {
            case "ping":
                //the app is ready to be loaded
                pingRef.current = true
                setPingReceived(true)
                break
            case "query_indicator_length": 
                await queryIndicatorLength(
                    data, 
                    authData, 
                    quantaId, 
                    postMessage,
                    categorization,
                    pipelineLinks,
                    getSchema
                )

                break
            case "query_paged_indicators":
                await querySelectedIndicatorsPage(
                    data, 
                    authData, 
                    quantaId, 
                    postMessage,
                    categorization,
                    pipelineLinks,
                    getSchema
                )

                break
            case "query_indicator":
                await queryIndicatorHandler(
                    data, 
                    authData, 
                    quantaId, 
                    postMessage,
                    categorization,
                    pipelineLinks,
                    getSchema
                )

                break
            case "query_indicator_page":
                await queryIndicatorsPage(
                    data, 
                    authData, 
                    quantaId, 
                    postMessage
                )

                break
            case "indicators_length":
                await indicatorsLength(
                    data, 
                    authData, 
                    quantaId, 
                    postMessage
                )

                break

            case "query_indicator_by_id":
                await queryIndicatorId(
                    data, 
                    authData, 
                    quantaId, 
                    postMessage
                )   

                break
            default:
                break
        }
    } catch (error) {
        showNotification({
            title: "Selector Error",
            message: `Error with selector -> ${error}`,
            color: 'red',
            autoClose: 1000 * 5
        })
    }
}

export { messageHandler }