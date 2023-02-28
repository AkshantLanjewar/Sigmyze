import { IQuantaSocket } from "../../types"
import DynamicOutput from "./dynamic-output"
import NodeOutput from "./node-output"

interface IOutputRendererProps {
    output: IQuantaSocket,
    nodeId?: string,
    focused: boolean,
    unfocus: () => void
}

const OutputRenderer: React.FC<IOutputRendererProps> = ({ output, nodeId, focused, unfocus }) => {
    return (
        <>
            {output.dynamicSocket
                ? <DynamicOutput />
                : (
                    <NodeOutput
                        output={output}
                        nodeId={nodeId}
                        focused={focused}
                        unfocus={unfocus}
                    />
                )
            }
        </>
    )
}

export default OutputRenderer