import NodeRenderer from "./node/node-renderer"
import prebuildNodeDict from "./prebuilt_nodes"
import { IQuantaRFNodeData } from "./types"

interface IQuantaNodeProps {
    data?: IQuantaRFNodeData
}

const QuantaNode: React.FC<IQuantaNodeProps> = ({ data }) => {
    return (
        <div>
            {data?.instructionId && <NodeRenderer instructions={prebuildNodeDict[data.instructionId]} />}
        </div>
    )
}

export default QuantaNode