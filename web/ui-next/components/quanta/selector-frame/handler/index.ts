import { showNotification } from "@mantine/notifications"
import { queryIndicatorHandler } from "./indicator-data"
import { IAuthenticationData } from "../../../data/user/types"

const messageHandler = async (
    func: string, 
    data: string,
    authData: IAuthenticationData | null | undefined,
    quantaId: string | null,
    postMessage: (msg: string) => void
) => {
    try {
        switch(func) {
            case "query_indicator":
                await queryIndicatorHandler(data, authData, quantaId, postMessage)
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