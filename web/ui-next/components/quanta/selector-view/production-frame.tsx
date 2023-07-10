import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react"
import { IQuantaCategorization, IQuantaSelector, IQuantaTextStore, ProjectSchemas } from "../../data/quanta/types/project"
import { IIFrameMessage } from "../selector-pane/selector-frame-tester/types"
import productionMessageHandler from "./handler"
import { buildAnalysis } from "../selector-frame/analysis"
import { IPipelineMessage, IQuantaQuery } from "../selector-frame/types"
import FrameView from "./production-frame-view"
import { IPipelineAnalysis } from "../selector-pane/context/types"

interface IProductionSelectorFrameProps {
    selector: IQuantaSelector,
    publicToken: string | undefined,
    categorization: IQuantaCategorization | undefined,
    schemas: ProjectSchemas[],
    textStore: IQuantaTextStore,
    selectionIndex: number | undefined,
    setSelectorValue: (selectorId: string, value: string) => void,
    setSelectedIndicator: Dispatch<SetStateAction<string | undefined>>,
    selectedValues: {
        [key: string]: string | undefined;
    } 
}

const ProductionSelectorFrame: React.FC<IProductionSelectorFrameProps> = ({ 
    selector, 
    publicToken, 
    categorization,
    schemas,
    textStore,
    selectionIndex,
    selectedValues,
    setSelectorValue ,
    setSelectedIndicator
}) => {
    const [code, setCode] = useState<string | undefined>(undefined)
    const [msgCache, setMsgCache] = useState<string[]>([])
    
    const pingReceived = useRef<boolean>(false)
    const [flushCache, setFlushCache] = useState(false)

    const intialSelection = useRef<boolean>(false)
    const iframeRef = useRef<HTMLIFrameElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let sourceCode = selector.selectorCode
        if(sourceCode === undefined)
            return

        setCode(sourceCode.sourceCode)
    }, [selector])

    //effect that is able to update the internal state analysis of the selector
    useEffect(() => {
        let pipelineLinks = selector.selectorPipeline?.pipelineLinks
        let pipelineAnalysis = selector.selectorPipeline?.pipelineAnalysis
        if(pipelineAnalysis === undefined)
            return

        let analysis = buildAnalysis(
            pipelineLinks,
            pipelineAnalysis,
            undefined,
            categorization,
            textStore
        )

        if(selectionIndex !== undefined) {
            let selectedKeys = Object.keys(selectedValues)
            let collected_queries = [] as IQuantaQuery[]

            for(let i = 0; i < selectedKeys.length; i++) {
                if(i > selectionIndex)
                    continue

                let key = selectedKeys[i]
                let value = selectedValues[key]
                if(value === undefined)
                    continue

                let selectedAnalysis: IQuantaQuery[] = JSON.parse(value)
                collected_queries = [ ...collected_queries, ...selectedAnalysis ]
            }

            //now we build the additional analysis objects
            for(let i = 0; i < collected_queries.length; i++) {
                let query = collected_queries[i]
                let analysisObject = {} as IPipelineAnalysis
                if(query.fieldType === "string")
                    analysisObject.objectType = "string"

                analysisObject.objectId = `query::${query.fieldKey}`
                analysisObject.stringValue = query.stringField
                analysisObject.dateValue = query.dateField
                analysis.push(analysisObject)
            }
        }

        const pipelineMessage: IPipelineMessage = {
            analysis: analysis
        }

        const frameMessage: IIFrameMessage = {
            function: "pipeline",
            data: JSON.stringify(pipelineMessage)
        }

        postMessage(JSON.stringify(frameMessage))
    }, [selector, textStore, categorization, selectionIndex, selectedValues])

    //effect that flushes all the cache into the selector once the ping has been received
    useEffect(() => {
        if(flushCache !== true)
            return
        
        for(let i = 0; i < msgCache.length; i++) {
            let msg = msgCache[i]
            postMessage(msg)
        }

        //reset after the cache has been flushed
        setFlushCache(false)
    }, [flushCache])

    useEffect(() => {
        const handler = (event: MessageEvent<any>) => {
            handlerFunc(event)
        }

        pingReceived.current = false
        intialSelection.current = false
        setFlushCache(false)

        window.addEventListener("message", handler)
        return () => window.removeEventListener("message", handler)
    }, [code])

    const handlerFunc = useCallback((event: MessageEvent<any>) => {
        async function main() {
            try {
                if(typeof event.data !== "string")
                    throw Error("wrong_msg")

                let parsedMessage: IIFrameMessage = JSON.parse(event.data)
                if(parsedMessage.data === undefined || parsedMessage.function === undefined)
                    throw Error("bad_request")
                if(selector.selectorPipeline?.pipelineLinks === undefined)
                    throw Error("bad_links")

                let func = parsedMessage.function
                let selectorId = selector.selectorId
                let selectorLink = selector.selectorCode?.selectorLinks

                if(selectorId === undefined)
                    throw Error("no_selector_id")
                if(selectorLink === undefined)
                    throw Error("no_links")

                await productionMessageHandler(
                    selectorId,
                    func,
                    parsedMessage.data,
                    publicToken,
                    categorization,
                    selector.selectorPipeline.pipelineLinks,
                    pingReceived,
                    getSchema,
                    postMessage,
                    setFlushCache,
                    intialSelection,
                    selectorLink,
                    setSelectorValue,
                    setSelectedIndicator
                ) 
            } catch (error) {
                console.debug(`[ERROR]: ${error}`)
            }
        }

        main()
    }, [publicToken, selector, setSelectorValue])

    const onLoad = useCallback(() => {
        if(iframeRef.current === null)
            return

        const contentWindow = iframeRef.current.contentWindow
        let bodyDisplay = contentWindow?.document.querySelector("body")
        if(bodyDisplay !== undefined) {
            contentWindow!.document.querySelector("body")!.style.display = "flex"
            contentWindow!.document.querySelector("body")!.style.padding = "0"
            contentWindow!.document.querySelector("body")!.style.margin = "0"
            contentWindow!.document.querySelector("body")!.style.overflow = "hidden"
            contentWindow!.document.querySelector("body")!.style.background = "#101113"
        }
    }, [])

    const getSchema = useCallback((schemaId: string) => {
        let schema = undefined
        for(let i = 0; i < schemas.length; i++) {
            let schemaContainer = schemas[i]
            if(schemaContainer.schemaId === schemaId)
                schema = schemaContainer.schema
        }

        return schema
    }, [schemas])

    const postMessage = useCallback((msg: string) => {
        if(pingReceived.current === false || iframeRef.current === null) {
            let nMessageCache = msgCache
            nMessageCache.push(msg)

            setMsgCache([ ...nMessageCache ])
            return
        }

        iframeRef.current.contentWindow?.postMessage(msg)
    }, [msgCache])
    
    return (
        <FrameView
            containerRef={containerRef}
            iframeRef={iframeRef}
            code={code}
            onLoad={onLoad}
        />
    )
}

export default ProductionSelectorFrame