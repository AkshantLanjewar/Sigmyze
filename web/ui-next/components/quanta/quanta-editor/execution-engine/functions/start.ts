import { ICallStackFunc } from "../types"

function startExecute(this: any, stack: ICallStackFunc ) {
    this.logMsg("Executing Start")
    this.setOutputValue(stack.nodeId, "execute_output", true)
}

export default startExecute