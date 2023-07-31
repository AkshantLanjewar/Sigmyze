import { IIFrameMessage } from "../../selector-pane/selector-frame-tester/types"
import { IResolverBody } from "../types"

const buildFrameMessage = (requestId: string, data: any) => {
    const resolverBody: IResolverBody = {
        requestId,
        requestData: JSON.stringify(data)
    }

    const frameMessage: IIFrameMessage = {
        function: "queryIndicator",
        data: JSON.stringify(resolverBody)
    }

    return JSON.stringify(frameMessage)
}

export { buildFrameMessage }