import { ICallStackFunc } from "../types"

async function startNode(
    stack: ICallStackFunc, 
    setOutputValue: (nodeId: string, socketId: string, val: any) => void
) {
    await setOutputValue(stack.nodeId, "execute_output", true)
    console.debug('Executed Start Node')
}

export default startNode