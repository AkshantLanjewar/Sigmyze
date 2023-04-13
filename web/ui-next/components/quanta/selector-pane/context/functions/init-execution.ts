import { Dispatch, SetStateAction } from "react";

async function initExecutionContext(
    compilationId: string,
    setInitialized: Dispatch<SetStateAction<boolean>>,
    executeSocketFunction: (processId: string, nodeId: string, functionId: string, outputIds: string[], functionData: any, cb: (val: string) => void) => string | undefined
) {

}

export { initExecutionContext }