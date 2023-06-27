import React, { MutableRefObject } from "react"
import { v4 } from "uuid"

interface IFrameViewProps {
    containerRef: MutableRefObject<HTMLDivElement | null>,
    iframeRef: MutableRefObject<HTMLIFrameElement | null>,
    code: string | undefined,
    onLoad: () => void
}

const FrameView: React.FC<IFrameViewProps> = React.memo(({
    containerRef,
    iframeRef,
    code,
    onLoad
}) => {
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
                    height={550}
                    ref={iframeRef}
                    style={{ border: 0 }}
                    onLoad={onLoad}
                />
            )}
        </div>
    )
})

export default FrameView