import { SyntheticEvent, useRef, useState } from "react"
import { IQuantaSelectorCode } from "../../data/quanta/types/project"

interface ISelectorFrameProps {
    source: IQuantaSelectorCode
}

const SelectorFrame: React.FC<ISelectorFrameProps> = ({ source }) => {
    const [dims, setDims] = useState({ width: 0, height: 0 })
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
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