import { IconEngine, IconPlayerPlay } from "@tabler/icons"
import { Handle, Position } from "reactflow"
import NodeRenderer from "./node/node-renderer"
import { IQuantaNodeInstructions, IQuantaRFNodeData } from "./types"

interface IQuantaNodeProps {
    data?: IQuantaRFNodeData
}

const QuantaNode: React.FC<IQuantaNodeProps> = ({ data }) => {
    const prebuildNodeDict = {
        "start": {
            name: "Start",
            icon: <IconPlayerPlay />,
            
            outputs: [
                {
                    type: "thread",
                    outputId: "execute_output",
                    outputName: "Execution Thread",
                    icon: <IconEngine />,
                    hideType: true
                }
            ]
        }
    } as { [key: string]: IQuantaNodeInstructions }

    return (
        <div>
            {data?.instructionId && <NodeRenderer instructions={prebuildNodeDict[data.instructionId]} />}
        </div>
    )
}

export default QuantaNode