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
import { buildAnalysis } from "./analysis"
import { v4 } from "uuid"
import { useEffectDebugger } from "../../ui/debug"

interface ISelectorFrameProps {
    source: IQuantaSelectorCode,
    pipelineAnalysis?: IPipelineAnalysis[],
    pipelineLoading?: boolean,
    pipelineLinks?: {[key: string]: string},
    query?: IQuantaQuery[]
}

const SelectorFrame: React.FC<ISelectorFrameProps> = ({ source, pipelineLoading, pipelineAnalysis, pipelineLinks, query }) => {
    const [dims, setDims] = useState({ width: 200, height: 0 })
    const [containerDims, setContainerDims] = useState({ width: 0, height: 0 })

    const [key, setKey] = useState(v4())
    const [pingReceived, setPingReceived] = useState(false)
    const [msgCache, setMsgCache] = useState<string[]>([])

    //data refs
    const pingRef = useRef<boolean>(false)

    const iframeRef = useRef<HTMLIFrameElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    const [internalLoading, setInternalLoading] = useState(false)

    const { authData } = useContext(UserContextData) as IUserContext
    const { quantaId, categorization, updateCategorization, getSchema } = useContext(QuantaContextData) as IQuantaState

    const postMessage = (msg: string) => {
        if(iframeRef.current === null)
            return
        if(pingRef.current === false) {
            let nMessageCache = msgCache
            nMessageCache.push(msg)

            setMsgCache([ ...nMessageCache ])
            return
        }

        iframeRef.current.contentWindow?.postMessage(msg)
    }

    useEffect(() => {
        if(containerRef.current === null)
            return

        let contDims = containerRef.current.getBoundingClientRect()
        let width = contDims.width
        let height = contDims.height

        setContainerDims({ width, height }) 
    }, []) 

    //handler
    async function main(event: MessageEvent<any>) {
        try {
            let parsedMessage: IIFrameMessage = JSON.parse(event.data)
            if(parsedMessage.data === undefined || parsedMessage.function === undefined)
                throw Error("bad_request")

            let func = parsedMessage.function
            await messageHandler(
                func, 
                parsedMessage.data, 
                authData, 
                quantaId, 
                postMessage,
                setPingReceived,
                categorization,
                pipelineLinks,
                getSchema,
                pingRef
            )
        } catch(e) { }
    }

    //setup the loader
    useEffect(() => {
        const handler = (event: MessageEvent<any>) => {
            main(event)
        }

        window.addEventListener("message", handler)
        setPingReceived(false)

        return () => window.removeEventListener("message", handler)
    }, [source.sourceCode])

    useEffect(() => {
        if(pipelineLoading === undefined)
            return

        setInternalLoading(pipelineLoading)
    }, [pipelineLoading])

    //flush the cache when we receive ping
    useEffect(() => {
        if(pingReceived === false)
            return
        if(iframeRef.current === null)
            return

        for(let i = 0; i < msgCache.length; i++) {
            let msg = msgCache[i]
            iframeRef.current.contentWindow?.postMessage(msg)
        }
    }, [pingReceived, msgCache])

    //updates the internal analysis of the selector
    useEffect(() => {
        if(internalLoading === true)
            return
        if(pipelineAnalysis === undefined)
            return

        //push the data to the frame
        let nAnalysis = buildAnalysis(pipelineLinks, pipelineAnalysis, query, categorization)
        const pipelineMessage: IPipelineMessage = {
            analysis: nAnalysis
        }

        const frameMessage: IIFrameMessage = {
            function: "pipeline",
            data: JSON.stringify(pipelineMessage)
        }

        postMessage(JSON.stringify(frameMessage))
    }, [pipelineAnalysis, internalLoading, pipelineLinks, query, updateCategorization, source.sourceCode])

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

                if(width < containerDims.width)
                    width = containerDims.width
                if(height < containerDims.height)
                    height = containerDims.height

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
        <div 
            ref={containerRef}
            style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                position: 'relative',
                height: '100%' 
            }}
        >
            <LoadingOverlay
                visible={internalLoading}
                overlayBlur={2}
            />

            <iframe
                key={key}
                srcDoc={source.sourceCode}
                width={dims.width}
                height={dims.height}
                ref={iframeRef}
                onLoad={onLoad}
                style={{ border: 0 }}
            />
        </div>
    )
}

export * from './query-builder'
export default SelectorFrame