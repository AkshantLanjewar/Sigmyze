import { SelectDatasetIndicator } from "../../../data/quanta/dataset-api"
import { IQuantaCategorization } from "../../../data/quanta/types/project"
import { IQuantaSchema } from "../../schema-editor/types"
import { parseIncomingQuery } from "../../selector-frame/analysis"
import { buildFrameMessage } from "../../selector-frame/handler"
import { IIndicatorBody, IQueryIndicator } from "../../selector-frame/types"

const queryIndicatorPublicHandler = async (
    data: string,
    publicToken: string | undefined,
    postMessage: (msg: string) => void,
    categorization: IQuantaCategorization | undefined,
    pipelineLinks: {[key: string]: string} | undefined,
    getSchema: (parentId: string) => IQuantaSchema | undefined
) => {
    let parsed: IQueryIndicator = JSON.parse(data)
    let query = parseIncomingQuery(parsed.query, categorization, pipelineLinks, getSchema)
    if(publicToken === undefined)
        throw Error("no_token")

    let indicators = await SelectDatasetIndicator(publicToken, query)
    if(indicators === undefined)
        throw Error("no_indicators")
        
    const resolveBody: IIndicatorBody = { indicators }
    postMessage(buildFrameMessage(parsed.requestId, resolveBody))
}

const queryIndicatorsPagePublicHandler = async (

) => {

}

export {
    queryIndicatorPublicHandler,
    queryIndicatorsPagePublicHandler
}