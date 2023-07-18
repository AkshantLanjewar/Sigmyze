import { memo } from "react";
import { IQuantaSocket } from "../../types/types";
import OutputRenderer from "../output/OutputRenderer";

interface IViewProps {
    iterOutputs: IQuantaSocket[],
    nodeId: string | undefined,
    internalFocused: boolean,
    parentId: string | undefined
}

const IterBodyView: React.FC<IViewProps> = memo(({
    iterOutputs,
    nodeId,
    internalFocused,
    parentId
}) => {
    return (
        <>
            {iterOutputs.map((step) => (
                <OutputRenderer
                    output={step}
                    nodeId={nodeId}
                    focused={internalFocused}
                    parentId={parentId}
                    unfocus={() => {  }}
                />
            ))}
        </>
    )
})

export default IterBodyView