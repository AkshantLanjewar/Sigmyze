import { useContext, useEffect, useRef, useState } from "react"
import { IQuantaSelectorCode } from "../../data/quanta/types/project"
import { IPipelineAnalysis } from "../selector-pane/context/types"
import { LoadingOverlay } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { IIFrameMessage } from "../selector-pane/selector-frame-tester/types"
import { IIndicatorBody, IPipelineMessage, IQueryIndicator, IResolverBody } from "./types"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import { SelectIndicator } from "../../data/quanta/quanta-api"

interface ISelectorFrameProps {
    source: IQuantaSelectorCode,
    pipelineAnalysis?: IPipelineAnalysis[],
    pipelineLoading?: boolean
}

const SelectorFrame: React.FC<ISelectorFrameProps> = ({ source, pipelineLoading, pipelineAnalysis }) => {
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
                    if(func === "query_indicator") {
                        let parsedQuery: IQueryIndicator = JSON.parse(parsedMessage.data)
                        let query = parsedQuery.query

                        let token = authData?.token
                        if(token === undefined)
                            throw Error("no_token")
                        if(quantaId === undefined || quantaId === null)
                            throw Error("no_quanta")

                        let indicators = await SelectIndicator(token, quantaId, query)
                        if(indicators === undefined)
                            throw Error("no_indicator")

                        let resolveBody = { indicators: indicators } as IIndicatorBody
                        let resolverBody = {
                            requestId: parsedQuery.requestId,
                            requestData: JSON.stringify(resolveBody)
                        } as IResolverBody

                        let frameMessage: IIFrameMessage = {
                            function: "queryIndicator",
                            data: JSON.stringify(resolverBody)
                        }

                        postMessage(JSON.stringify(frameMessage))
                    }
                } catch(e) {
                    showNotification({
                        title: "Analysis Error",
                        message: `Error parsing selector message -> ${e}`,
                        color: 'red',
                        autoClose: 1000 * 5
                    })
                }
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

    useEffect(() => {
        if(internalLoading === true)
            return
        if(pipelineAnalysis === undefined)
            return

        let pipelineMessage: IPipelineMessage = {
            analysis: pipelineAnalysis
        }

        let frameMessage: IIFrameMessage = {
            function: "pipeline",
            data: JSON.stringify(pipelineMessage)
        }

        postMessage(JSON.stringify(frameMessage))
    }, [pipelineAnalysis])

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

export default SelectorFrame