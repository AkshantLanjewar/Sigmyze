import { useCallback, useEffect, useRef, useState } from "react"
import { v4 } from "uuid"
import { IQuantaCategorization, IQuantaSelector } from "../../data/quanta/types/project"
import { IIFrameMessage } from "../selector-pane/selector-frame-tester/types"
import productionMessageHandler from "./handler"
import { IQuantaSchema } from "../schema-editor/types"

interface IProductionSelectorFrameProps {
    selector: IQuantaSelector,
    publicToken: string | undefined,
    quantaId: string | null,
    categorization: IQuantaCategorization | undefined,
    schemas: IQuantaSchema[]
}

const ProductionSelectorFrame: React.FC<IProductionSelectorFrameProps> = ({ 
    selector, 
    publicToken, 
    quantaId,
    categorization,
    schemas 
}) => {
    const [code, setCode] = useState<string | undefined>(undefined)
    const [msgCache, setMsgCache] = useState<string[]>([])
    
    const pingReceived = useRef<boolean>(false)
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
        const handler = (event: MessageEvent<any>) => {
            handlerFunc(event)
        }

        window.addEventListener("message", handler)
        pingReceived.current = false

        return () => window.removeEventListener("message", handler)
    }, [code])

    const handlerFunc = useCallback((event: MessageEvent<any>) => {
        async function main() {
            let parsedMessage: IIFrameMessage = JSON.parse(event.data)
            if(parsedMessage.data === undefined || parsedMessage.function === undefined)
                throw Error("bad_request")
            if(selector.selectorPipeline?.pipelineLinks === undefined)
                throw Error("bad_links")

            let func = parsedMessage.function
            await productionMessageHandler(
                func,
                parsedMessage.data,
                publicToken,
                quantaId,
                categorization,
                selector.selectorPipeline.pipelineLinks,
                pingReceived,
                getSchema,
                postMessage
            )
        }

        try { main() } catch (error) { console.debug(`[ERROR]: ${error}`) }
    }, [publicToken, quantaId])

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
        return schemas[0]
    }, [schemas])

    const postMessage = useCallback((msg: string) => {
        if(iframeRef.current === null)
            return
        if(pingReceived.current === false) {
            let nMessageCache = msgCache
            nMessageCache.push(msg)

            setMsgCache([ ...nMessageCache ])
            return
        }

        iframeRef.current.contentWindow?.postMessage(msg)
    }, [])
    
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
            {code && (
                <iframe
                    key={v4()}
                    srcDoc={code}
                    width={"100%"}
                    height={400}
                    ref={iframeRef}
                    style={{ border: 0 }}
                    onLoad={onLoad}
                />
            )}
        </div>
    )
}

export default ProductionSelectorFrame