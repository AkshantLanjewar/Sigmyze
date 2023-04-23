import { Dispatch, SetStateAction } from "react";
import { v4 } from "uuid";
import { IInternalStore } from "../../../quanta-editor/execution-engine/nodes/types";

interface IInitExecutionContextBody {
    input: IInternalStore
}

function initExecutionContext(
    compilationId: string,
    setInitialized: Dispatch<SetStateAction<boolean>>,
    executeSocketFunction: (processId: string, nodeId: string, functionId: string, outputIds: string[], functionData: any, cb: (val: string) => void) => string | undefined
) {
    const nodeId = v4()
    const functionId = "init_compilation"
    const outputIds = [] as string[]
    const functionData: IInitExecutionContextBody = {
        input: {
            nodeId: nodeId,
            socketId: compilationId
        }
    }

    const promise = new Promise((res, rej) => {
        const handler = (val: string) => {
            if(val === "init")
                setInitialized(true)
            res(true)
        }
    
        executeSocketFunction(
            compilationId,
            nodeId,
            functionId,
            outputIds,
            functionData,
            handler
        )
    })

    return promise
}

export { initExecutionContext }