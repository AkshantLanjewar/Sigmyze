import { memo } from "react"
import { IQuantaSocket } from "../../types/types"
import DynamicOutput from "./dynamic-output"
import NodeOutput from "./node-output"

interface IOutputRendererProps {
    output: IQuantaSocket,
    nodeId?: string,
    focused: boolean,
    unfocus: () => void,
    parentId?: string,
    index: number
}

const OutputRenderer: React.FC<IOutputRendererProps> = memo(({ output, nodeId, focused, unfocus, parentId, index }) => {
    return (
        <div data-testId={`output-${index}`}>
            {output.dynamicSocket
                ? (
                    <DynamicOutput 
                        output={output}
                        nodeId={nodeId}
                        focused={focused}
                        parentId={parentId}
                    />
                )
                : (
                    <NodeOutput
                        output={output}
                        nodeId={nodeId}
                        focused={focused}
                        unfocus={unfocus}
                        parentId={parentId}
                        index={index}
                    />
                )
            }
        </div>
    )
})

export default OutputRenderer