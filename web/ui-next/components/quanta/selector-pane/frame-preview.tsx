import { useContext } from "react"
import { SelectorPaneContextData } from "./context"
import { ISelectorPaneState } from "./context/types"
import SelectorFrame from "../selector-frame"

const FramePreview: React.FC = ({ }) => {
    const { selectorCode, analyzePipelineLoading, pipelineAnalysis } = useContext(SelectorPaneContextData) as ISelectorPaneState

    return (
        <div>
            {selectorCode
                ? (
                    <SelectorFrame 
                        source={selectorCode} 
                        pipelineLoading={analyzePipelineLoading}
                        pipelineAnalysis={pipelineAnalysis}
                    />
                )
                : null
            }
        </div>
    )
}

export default FramePreview