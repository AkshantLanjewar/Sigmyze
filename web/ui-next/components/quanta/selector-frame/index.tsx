import { useContext, useEffect, useRef, useState } from "react"
import { IQuantaSelectorCode } from "../../data/quanta/types/project"
import { IPipelineAnalysis } from "../selector-pane/context/types"
import { LoadingOverlay } from "@mantine/core"
import { IIFrameMessage } from "../selector-pane/selector-frame-tester/types"
import { IPipelineMessage, IQuantaQuery } from "./types"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import { messageHandler } from "./handler"

interface ISelectorFrameProps {
    source: IQuantaSelectorCode,
    pipelineAnalysis?: IPipelineAnalysis[],
    pipelineLoading?: boolean,
    pipelineLinks?: {[key: string]: string},
    query?: IQuantaQuery[]
}

const SelectorFrame: React.FC<ISelectorFrameProps> = ({ source, pipelineLoading, pipelineAnalysis, pipelineLinks, query }) => {
    const [dims, setDims] = useState({ width: 0, height: 0 })
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    const [internalLoading, setInternalLoading] = useState(false)

    const { authData } = useContext(UserContextData) as IUserContext
    const { quantaId } = useContext(QuantaContextData) as IQuantaState

    const postMessage = (msg: string) => {
        if(iframeRef.current === null)
            return

        iframeRef.current.contentWindow?.postMessage(msg)
    }

    //setup the loader
    useEffect(() => {
        const handler = (event: MessageEvent<any>) => {
            async function main() {
                try {
                    let parsedMessage: IIFrameMessage = JSON.parse(event.data)
                    if(parsedMessage.data === undefined || parsedMessage.function === undefined)
                        throw Error("bad_request")
    
                    let func = parsedMessage.function
                    await messageHandler(func, parsedMessage.data, authData, quantaId, postMessage)
                } catch(e) { }
            }

            main()
        }

        window.addEventListener("message", handler)

        return () => window.removeEventListener("message", handler)
    }, [source.sourceCode])

    useEffect(() => {
        if(pipelineLoading === undefined)
            return

        setInternalLoading(pipelineLoading)
    }, [pipelineLoading])

    //updates the internal analysis of the selector
    useEffect(() => {
        if(internalLoading === true)
            return
        if(pipelineAnalysis === undefined)
            return

        function isReserved(id: string) : string | undefined {
            if(pipelineLinks === undefined)
                return

            let keys = Object.keys(pipelineLinks)
            for(let i = 0; i < keys.length; i++) {
                let key = keys[i]
                let val = pipelineLinks[key]

                if(val === id)
                    return key
            }

            return undefined
        }

        let nAnalysis = [] as IPipelineAnalysis[]
        for(let i = 0; i < pipelineAnalysis.length; i++) {
            let analysis = pipelineAnalysis[i]
            let reserved = isReserved(analysis.objectId)
            if(reserved !== undefined)
                analysis.objectId = reserved

            nAnalysis.push(analysis)
        }

        //build the final portions of analysis based on retreived queries now
        let internalQuery = [] as IQuantaQuery[]
        if(query !== undefined)
            internalQuery = query

        for(let i = 0; i < internalQuery.length; i++) {
            let queryItem = internalQuery[i]
            let analysis = {} as IPipelineAnalysis
            if(queryItem.fieldType === "string")
                analysis.objectType = "string"

            analysis.objectId = `query::${queryItem.fieldKey}`
            analysis.stringValue = queryItem.stringField
            analysis.dateValue = queryItem.dateField
            nAnalysis.push(analysis)
        }

        //push the data to the frame
        const pipelineMessage: IPipelineMessage = {
            analysis: nAnalysis
        }

        const frameMessage: IIFrameMessage = {
            function: "pipeline",
            data: JSON.stringify(pipelineMessage)
        }

        postMessage(JSON.stringify(frameMessage))
    }, [pipelineAnalysis, internalLoading, pipelineLinks, query])

    const onLoad = () => {
        if(iframeRef.current === null)
            return

        const frame = iframeRef.current
        const contentWindow = frame.contentWindow

        //set the body to display flex
        let bodyDisplay = contentWindow?.document.querySelector("body")?.style
        if(bodyDisplay !== undefined) {
            contentWindow!.document.querySelector("body")!.style.display = "flex"
            contentWindow!.document.querySelector("body")!.style.padding = "0"
            contentWindow!.document.querySelector("body")!.style.margin = "0"
            contentWindow!.document.querySelector("body")!.style.overflow = "hidden"
            contentWindow!.document.querySelector("body")!.style.background = "#101113"
        }

        const body = contentWindow?.document.querySelector(`#${source.containerId}`)!
        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                let width = entry.contentRect.width
                let height = entry.contentRect.height

                setDims({ width: width, height: height })
            })
        })

        resizeObserver.observe(body)

        const onVisibilityChange = () => {
            resizeObserver.disconnect()
        }

        contentWindow?.addEventListener("beforeunload", onVisibilityChange)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <LoadingOverlay
                visible={internalLoading}
                overlayBlur={2}
            />

            <iframe
                srcDoc={source.sourceCode}
                width={dims.width}
                frameBorder={0}
                height={dims.height}
                ref={iframeRef}
                onLoad={onLoad}
            />
        </div>
    )
}

export * from './query-builder'
export default SelectorFrame