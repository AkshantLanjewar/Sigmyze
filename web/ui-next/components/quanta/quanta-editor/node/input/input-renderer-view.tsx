import { memo } from "react";
import { IQuantaSocket } from "../../types/node-instructions";
import { IQuantaRFNodeData } from "../../types/nodes";
import { IQuantaTypeRef } from "../../types/node-type";
import DynamicInput from "./dynamic-input";
import NodeInput from "./node-input";

interface IViewProps {
    controlledSocket: IQuantaSocket | undefined,
    input: IQuantaSocket,
    focused: boolean | undefined,
    nodeId: string | undefined,
    data: IQuantaRFNodeData | undefined,
    localType: IQuantaTypeRef | undefined,
    editType: (socketId: string, newType: IQuantaTypeRef) => void
}

const InputRendererView: React.FC<IViewProps> = memo(({
    controlledSocket,
    input,
    focused,
    nodeId,
    data,
    localType,
    editType
}) => {
    return (
        <div>
            {input.dynamicSocket
                ? (
                    <DynamicInput 
                        input={controlledSocket ? controlledSocket : input}
                        focused={focused}
                        nodeId={nodeId}
                        data={data}
                    />
                )
                : (
                    <NodeInput
                        socket={controlledSocket ? controlledSocket : input}
                        focused={focused}
                        localType={localType}
                        editType={editType}
                    />
                )
            }
        </div>
    )
})

export default InputRendererView