import { useContext } from "react"
import { SelectorPaneContextData } from "./context"
import { ISelectorPaneState } from "./context/types"
import SelectorFrame from "../selector-frame"

const FramePreview: React.FC = ({ }) => {
    const { selectorCode } = useContext(SelectorPaneContextData) as ISelectorPaneState

    return (
        <div>
            {selectorCode
                ? <SelectorFrame source={selectorCode} />
                : null
            }
        </div>
    )
}

export default FramePreview